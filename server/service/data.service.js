require('rootpath')();
const jwt = require('jsonwebtoken');
const Q = require('q');
const _ = require('lodash');
const omitempty= require ('omit-empty');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);
const log4js = require('log4js');
const logger = log4js.getLogger('data.service');


var dataservice = {};



dataservice.getview = getview;
dataservice.getviewSelectByID = getviewSelectByID;
dataservice.getroleholders = getroleholders;
dataservice.delroleholders = delroleholders;
dataservice.updtroleholders = updtroleholders



module.exports = dataservice;



function getview(_viewname) {

    var deferred = Q.defer();

    knex(_viewname)
    .then(function (res){
        deferred.resolve(JSON.stringify(res));
    })
    .catch(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}

function getviewSelectByID(_id, _viewname) {

    var deferred = Q.defer();

    knex(_viewname).where('ID', _id)
    .then(function (res){
        deferred.resolve(res);
    })
    .catch(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}


function getroleholders(_id) {

    var deferred = Q.defer();

    knex('vupersonnamesroles').select('ID', 'name').where('roleid', _id)
    .then(function (res){
        deferred.resolve(JSON.stringify(res));
    })
    .catch(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}

function delroleholders(_id) {

    var deferred = Q.defer();

    knex('roles').where('roleID', _id).del()
    .then(function (res){
        console.log('Adatbázis válasz: ' + JSON.stringify(res));
        deferred.resolve(res + _id);        
    })
    .catch(function(err){
        console.log('Ez az error: ' + JSON.stringify(err));
        deferred.reject(err);
    });

    return deferred.promise;
}

function updtroleholders(req) {

    var deferred = Q.defer();

    knex('roles').where('roleID', req.body[0].roleID).del()
    .then( () => {
        knex('roles').insert(req.body)
        .then( res => {deferred.resolve(res);
            console.log('Adatbázis válasz: ' + JSON.stringify(res));
        })
        .catch(err => {deferred.reject(err); 
            console.log('Ez az error az updateből: ' + JSON.stringify(err));
        });
    })
    .catch(function(err){
        console.log('Ez az error a deleteből : ' + JSON.stringify(err));
        deferred.reject(err);
    });

    return deferred.promise;
}






