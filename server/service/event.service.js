require('rootpath')();
//const jwt = require('jsonwebtoken');
const Q = require('q');
const _ = require('lodash');
const omitempty= require ('omit-empty');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('event.service');
const dstsrvc = require ('server/service/dst.service');



var eventservice = {};


eventservice.addevent = addevent;
eventservice.deleteevent = deleteevent;
eventservice.updateevent = updateevent;
eventservice.register = register;
eventservice.unregister = unregister;
eventservice.getreginfo = getreginfo;
eventservice.addpractice = addpractice;
eventservice.getpractice = getpractice;
eventservice.addattendance = addattendance;
eventservice.getpracticeregs = getpracticeregs;
eventservice.geteventregs = geteventregs;
eventservice.getregnames = getregnames;
eventservice.approveattendance = approveattendance;
eventservice.getexamyears = getexamyears;
eventservice.getpastexams = getpastexams;
eventservice.updateExamResult = updateExamResult;
eventservice.updateExamResultRank = updateExamResultRank;


module.exports = eventservice;




function addevent(req) {
    var deferred = Q.defer();


    knex('Event').select('ID')
        .where('locationID', req.body.locationID)
        .andWhere(knex.raw('YEAR(start) = ?', moment(req.body.start).year()))
        .andWhere(knex.raw('DAYOFYEAR(start) = ?', moment(req.body.start).dayOfYear()))
        .andWhere(knex.raw('HOUR(start) = ?', moment(req.body.start).hour()))
        .then((res) => {
            if (res.length === 0) {
                knex('event').insert({name: req.body.name,
                                    start: req.body.start.slice(0, 23),
                                    end: req.body.end.slice(0,23),
                                    locationID: req.body.locationID,
                                    eventtypeID: req.body.eventtypeID}
                                )
                .then(function(res){
  
                    deferred.resolve(res);  
                })
                .catch(function(err){
       
                    deferred.reject(err);
                });


            } else {
                deferred.reject('Ezen a helyszínen, erre az időpontra már van meghirdetve esemény!');
            }




        })
        .catch((err) => {deferred.reject(err);} );



    return deferred.promise;
}


function deleteevent(_id){
    var deferred = Q.defer();


    knex('Event').where('ID', _id).del()
    .then( function(res) {
        deferred.resolve(res);
    })
    .catch(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}


function updateevent(req) {
    var deferred = Q.defer();

    knex('Event').where('ID', req.body.ID)
    .update({   name: req.body.name,
                start: req.body.start.slice(0, 23),
                end: req.body.end.slice(0,23),
                locationID: req.body.locationID,
                eventtypeID: req.body.eventtypeID})
    .then(function(res){
  
        deferred.resolve(res);
    })
    .catch(function(err){

        deferred.reject(err);
    });


    return deferred.promise;
}


function register(req) {
    var deferred = Q.defer();

    knex('attendances').insert(req.body)
        .then( res => deferred.resolve(res) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise;    
}


function unregister(req) {
    var deferred = Q.defer();

    knex('attendances')
        .where('eventID', req.body.eventID)
        .andWhere('attendeeID', req.body.attendeeID)
        .del()
        .then( res => deferred.resolve(res) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise;    
}


function getreginfo(_id) {
    var deferred = Q.defer();

    knex('attendances')
        .select('eventID')
        .where('attendeeID', _id)     
        .then( res => deferred.resolve(res) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise;    
}


function addpractice(req) {
    var deferred = Q.defer();
    var dbresps = [];
    var errresps = [];

    dstsrvc.createProcCalls(req)
            .then(sqlStrings => {

                var lastPromise = sqlStrings.reduce(function(promise, sql) {
                    return promise.then(function (dbresp) {
    
    
                        return knex.raw(sql)
                                .then(dbresp => {logger.info('egyszeri knex: ' + JSON.stringify(dbresp));
                                    dbresps.push(dbresp); });
                    })
                    .catch(err => {errresps.push(err);
                                logger.error('baj van ' + _id + ' nem töltődött le'); });
            
                    },  Q.resolve()) ;
        
                lastPromise.then(lastresp => {
                            logger.info('All done');
                            logger.info('lastresp: ' + JSON.stringify(lastresp));
                            dbresps.push(lastresp);
                            logger.info('dbresps: ' + JSON.stringify(dbresps));
                            deferred.resolve(dbresps);
        
                            })
                            .catch( err => {logger.info('valami baj volt a sok között: ' + err);
                                deferred.reject(err)}); 
                                logger.info('sqlStrings' + JSON.stringify(sqlStrings));

            })
            .catch(err => {
                logger.error( 'Valami nem jó' + JSON.stringify(err));
                deferred.reject(err);
            })

    
    return deferred.promise;    
}


function getpractice(_trainingday, _locid) {
    var deferred = Q.defer();
        logger.info('_trainingday: ' + _trainingday);
        var date = new Date(parseInt(_trainingday));
        logger.info('date: ' + date);


        knex('vupractices')
        .select('ID', 'name')
        .where('locationID', _locid) 
        .andWhere(knex.raw('DATE(start) = ?;', JSON.stringify(date).slice(1,11) ))
        .then( dbresp => {logger.info('dbresp' + JSON.stringify(dbresp)); deferred.resolve(dbresp);
                    })
        .catch(err => deferred.reject(err));

    return deferred.promise;    
}


function addattendance(req) {
    var deferred = Q.defer();

    knex('attendances').insert(req.body)
    .then(dbresp =>  deferred.resolve(dbresp))
    .catch(err => deferred.reject(err));

    return deferred.promise;    
}


function getpracticeregs(_id) {
    var deferred = Q.defer();

    knex('vupracticeregs')
        .select('eventID', 'dojoname', 'practicedate', 'practice', 'noofregistered')
        .where('instructorID', _id)     
        .then( res => deferred.resolve(res) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise;    
}


function geteventregs() {
    var deferred = Q.defer();

    knex('vueventregs')
        .select('eventID', 'eventlocation', 'eventdate', 'eventname', 'noofregistered')    
        .then( res => deferred.resolve(res) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise;    
}


function getregnames(_id, _vuname) {
    var deferred = Q.defer();

    knex(_vuname)
        .select('ID', 'name')
        .where('eventID', _id)     
        .then( res => deferred.resolve(res) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise;    
}


function approveattendance(req) {
    var deferred = Q.defer();

    let attendedIDs = _.flattenDeep(_.remove(req.body, elem => {return elem.attended === true} )
                                     .map(elem => _.omit(elem, 'attended'))
                                     .map(elem => _.values(elem)));
logger.info(JSON.stringify(attendedIDs));
    knex('attendances').update('attendancetype', 'Attended')
                        .whereIn('attendeeID', attendedIDs)    
                        .andWhere('eventID',req.params._id)
                        .then(dbsrvresp0 => {

                            let notAttendedIDs = _.flattenDeep(req.body.map(elem => _.omit(elem, 'attended'))
                                                                        .map(elem => _.values(elem)));
                            logger.info(JSON.stringify(notAttendedIDs));
                            knex('attendances').whereIn('attendeeID',notAttendedIDs)
                                                .andWhere('eventID',req.params._id)
                                                .del()
                                                .then(dbsrvresp1 => deferred.resolve(dbsrvresp1))
                                                .catch(err => {logger.info(JSON.stringify(err)); 
                                                    deferred.reject(err); });
                        } )
                        .catch(err => {logger.info(JSON.stringify(err)); 
                                        deferred.reject(err); });
        
    return deferred.promise;    
}

function getexamyears (req) {
    var deferred = Q.defer();

    knex('vupastexams')
        .distinct(knex.raw('YEAR(start) as year'))
        .select()
        .then( dbresp => deferred.resolve(dbresp) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise; 

}


function getpastexams (_id) {
    var deferred = Q.defer();

    knex('vupastexams')
        .select(knex.raw('ID, concat(eventname, \' \', date(start), \' \', locationname) AS name'))
        .where(knex.raw('YEAR(start) = ?', [_id]))
        .then( dbresp => deferred.resolve(dbresp) )
        .catch(err => deferred.reject(err));
    
    return deferred.promise; 

}


function updateExamResult(req) {
    var deferred = Q.defer();


    knex('attendances')
    .where('attendeeID', req.body.ID)
    .andWhere('eventID', req.params._id)
    .update('attendancetype', req.body.attendancetype)
    .then(srvresp => deferred.resolve(srvresp))
    .catch(err => deferred.reject(err));


    
    return deferred.promise; 
}

function updateExamResultRank(req) {
    var deferred = Q.defer();

    console.log(JSON.stringify(_.pick(req.body,['attendancetype', 'certno'])));
    knex.transaction(trx => {

        return trx.update(_.pick(req.body,['attendancetype', 'certno']))
                .into('attendances')
                .where('attendeeID', req.body.ID)
                .andWhere('eventID', req.params._id)
                .then(() => {

                    return trx.update('rankID', req.body.rankID)
                            .into('person')
                            .where('ID', req.body.ID);
                });


    })
        .then(srvresp => deferred.resolve(srvresp))
        .catch(err => deferred.reject(err))


    
    return deferred.promise; 
}