require('rootpath')();
const Q = require('q');
const passport = require("passport");
const locationservice = require ('server/service/location.service');
const dataservice = require ('server/service/data.service');
const knexconfig = require ('server/knexconfig.json');
const knex = require('knex')(knexconfig);
const express = require('express');
const router = express.Router();



router.get('/getdojos', getdojos); // No JWT authentication as it needs for registration.
router.get('/getlocationnames', passport.authenticate('jwt', { session: false }), getlocationnames);
router.get('/getlocations', passport.authenticate('jwt', { session: false }), getlocations);
router.get('/getlocationtypes', passport.authenticate('jwt', { session: false }), getlocationtypes);
router.post('/addlocation', passport.authenticate('jwt', { session: false }), addlocation);
router.delete('/:_id', passport.authenticate('jwt', { session: false }), deletelocation);
router.put('/:_id', passport.authenticate('jwt', { session: false }), updatelocation);






module.exports = router;

function getdojos(req,res) {
    
    console.log(req.get('Authorization'));
    
    var viewname = 'vuDojonames';

    dataservice.getview(viewname)
    .then(function(dojos){
        res.status(200).send(dojos);
    })
    .catch(function(err){
        res.status(400).send(err);
    });    
}

function getlocationnames(req,res) {
    
    locationservice.getlocationnames()
    .then(function(locnames){
        res.status(200).send(locnames);
    })
    .catch(function(err){
        res.status(400).send(err);
    });    
}


function getlocations(req,res) {
    locationservice.getlocations()
    .then(function(locations){
        res.status(200).send(locations);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}

function getlocationtypes(req,res) {
    locationservice.getlocationtypes()
    .then(function(locationtypes){
        res.status(200).send(locationtypes);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}
function addlocation(req, res){ //TO DO Validation

    if(true){ 

        locationservice.addlocation(req)
        .then(function(data){
          res.status(200).send(data);
        })
        .catch(function (err) {
          res.status(400).send(JSON.stringify(err));
        });
    }else{
        res.status(400).json({message:"Please send valid data."});
        //Notify client to send valid data.
    }
}

function updatelocation(req, res){ //TO DO Validation
 

    if(true){ 

        locationservice.updatelocation(req)
        .then(function(data){
            console.log(JSON.stringify(data));
          res.sendStatus(200).send(data);
        })
        .catch(function (err) {
            console.log(JSON.stringify(err));
          res.sendStatus(400).send(err);
        });
    }else{
        res.sendStatus(400).json({message:"Please send valid data."});
        //Notify client to send valid data.
    }
}



function deletelocation(req, res) {
    locationservice.deletelocation(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}