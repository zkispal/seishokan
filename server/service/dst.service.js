require('rootpath')();
const Q = require('q');
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('dst.service');


var dstservice = {};



dstservice.createDSTDays = createDSTDays;
dstservice.chopByDST = chopByDST;
dstservice.createProcCalls = createProcCalls;


module.exports = dstservice;


function createDSTDays(_startYear, _endYear) {
    console.log('Kapott start év: ' + _startYear);
    console.log('Kapott end év: ' + _endYear);
    var q = Q.defer();

    var DSTDays = [];
    var month = 0;
    var day = 0;
    const hms = [3,0,0];


    if (_startYear <= _endYear &&
        1996 <= _startYear &&
        _startYear <= 2099 &&
        1996 <=_endYear  &&
        _endYear <= 2099) {
            
        for (var year = _startYear; year <= _endYear+1;  year++ ) {
        
            month = 2;
            day = 31-((Math.floor(5*year/4)+4)%7); 
            DSTDays.push( new Date (year, month, day, hms[0], hms[1], hms[2]));
            month = 9;
            day = 31-((Math.floor(5*year/4)+1)%7);
            DSTDays.push( new Date (year, month, day, hms[0], hms[1], hms[2]));
        }

        q.resolve(DSTDays);

    } else {
        q.reject('Invalid input');
    }

    return q.promise;

}


function chopByDST (_start, _end, _DSTdays){
    var q = Q.defer();
    console.log('Kapott start time: ' + _start);
    console.log('Kapott end time: ' + _end);

    if (_DSTdays.length>0 &&
        _start<_end &&
        _start.getFullYear() === _DSTdays[0].getFullYear() && 
        _end.getFullYear()+1 === _DSTdays[_DSTdays.length-1].getFullYear()) {

        var ranges = [];
        ranges[0] = [];
        ranges[1] = [];

        if ( _DSTdays[0] <= _start && _start < _DSTdays[1]) {  // check if the starting time is in summer time

            _DSTdays = _.tail(_DSTdays); // remove the first element of DST days as it is before start date
            ranges [0][0] = _start; // set the start of the first range to the original start date

            for (let i = 0; _end >  _DSTdays[i]; i++) {
                ranges[1][i] = _DSTdays[i];
                ranges[0][i+1] = _DSTdays[i];
                ranges[0][i+1].setHours(_start.getHours());
                ranges[0][i+1].setMinutes(_start.getMinutes());
            }
            ranges[1].push(_end);

            q.resolve(ranges);

        } else {
            if (_start > _DSTdays[1]) {
                _DSTdays = _.takeRight(_DSTdays, _DSTdays.length-2);
            }
            ranges [0][0] = _start;
            
            for (let i = 0; _end >  _DSTdays[i]; i++) {
                ranges[1][i] = _DSTdays[i];
                ranges[0][i+1] = _DSTdays[i];
                ranges[0][i+1].setHours(_start.getHours());
                ranges[0][i+1].setMinutes(_start.getMinutes());
            }
            ranges[1].push(_end);

            q.resolve(ranges);
        }
    } else {
        q.reject('Bad input')
    }
    return q.promise;
}


function createProcCalls(req) {

    var deferred = Q.defer();
    const startDate = new Date(req.body.timerange[0]);
    const endDate = new Date(req.body.timerange[1]);



    createDSTDays(startDate.getFullYear(), endDate.getFullYear())
        .then ( DSTDays => {
            chopByDST (startDate, endDate, DSTDays)
                .then( ranges => {

                    var sqlStrings = [];

                    for (let j = 0; j < req.body.weekdayID.length; j++) {

                        for ( let i = 0; i < ranges[0].length; i++) {

                            var sqlString = 'CALL addPractice(\'' + JSON.stringify(ranges[0][i]).slice(1,20) +
                                                '\', \''+ JSON.stringify(ranges[1][i]).slice(1,20) + '\', ' +
                                                req.body.weekdayID[j] + ', ' + req.body.practicelength + ', ' +
                                                req.body.locationID + ', ' + req.body.eventtypeID +');';

                            sqlStrings.push(sqlString);
                            logger.info(JSON.stringify(sqlString));
                         
                        }
                    } 
                    
                    deferred.resolve(sqlStrings);
                    
                })
                .catch(err => { console.log(err); deferred.reject(err); });
        })
        .catch(err =>  { console.log(err); deferred.reject(err); } );

    return deferred.promise; 
    
}