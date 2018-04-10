require('rootpath')();
//const jwt = require('jsonwebtoken');
const Q = require('q');
const _ = require('lodash');
//const omitempty= require ('omit-empty');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);


var locationservice = {};


locationservice.getlocationnames = getlocationnames;
locationservice.getlocationtypes = getlocationtypes;
locationservice.getlocations = getlocations;
locationservice.addlocation = addlocation;
locationservice.updatelocation = updatelocation;
locationservice.deletelocation = deletelocation;

module.exports = locationservice;




function getlocationnames() {

    var deferred = Q.defer();

    knex('location').select('ID', 'name')
    .then(function (names){
       deferred.resolve(JSON.stringify(names));
    })
    .catch(function(err){
        deferred.reject(err);
      });

    return deferred.promise;
}


function getlocations() {
    var deferred = Q.defer();

    knex('Location')
    .then(function (locations){
        deferred.resolve(JSON.stringify(locations));
    })
    .catch(function(err){
        deferred.reject(err);
    });
    return deferred.promise;
}

function getlocationtypes() {
    
    var deferred = Q.defer();

    knex('Location').distinct('locationtype').select()
    .then(function (res){

        var locationtypes = [];
        res.forEach(element => {
            locationtypes.push(element.locationtype);            
        });

        deferred.resolve(JSON.stringify(locationtypes));
    })
    .catch(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}

function addlocation(req) {
    var deferred = Q.defer();

knex('Location').select('address', 'city', 'zipcode')
    .where({address:req.body.address, city:req.body.city, zipcode:req.body.zipcode })
    .then(function(loc){
        if(loc.length === 0) {
    
            knex('Location')
            .insert(req.body)
            .then(function(res){
  
                deferred.resolve(res);
            })
            .catch(function(err){
   
                deferred.reject(err);
            });

        }
        else{deferred.reject('Location already exists');}
    })
    .catch(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}

function updatelocation(req) {
    var deferred = Q.defer();

    knex('Location').where('ID', req.body.ID).update(_.omit(req.body, 'ID'))
    .then(function(dbresp){
  
        deferred.resolve(dbresp);
    })
    .catch(function(err){

        deferred.reject(err);
    });


    return deferred.promise;
}

function deletelocation (_id){
    var deferred = Q.defer();

    knex('Location').where('ID', _id).del()
    .then( function(res) {
        deferred.resolve(res);
    })
    .catch(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
}