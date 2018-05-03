require('rootpath')();
const Q = require('q');
const passport = require("passport");
const validator = require('validator');
const authLoginService = require('server/service/authlogin.service');
const validatorService = require('server/service/validator.service');
const locationservice = require ('server/service/location.service');
const dataservice = require ('server/service/data.service');
const knexconfig = require ('server/knexconfig.json');
const knex = require('knex')(knexconfig);
const express = require('express');
const log4js = require('log4js');
const logger = log4js.getLogger('location.controller');
const router = express.Router();



router.get('/getdojos', getdojos); // No JWT authentication as it needs for registration.
router.get('/getlocationnames', passport.authenticate('jwt', { session: false }), getlocationnames);
router.get('/getlocations', passport.authenticate('jwt', { session: false }), getlocations);
router.get('/getlocationtypes', passport.authenticate('jwt', { session: false }), getlocationtypes);
router.post('/addlocation', passport.authenticate('jwt', { session: false }), addlocation);
router.delete('/:_id', passport.authenticate('jwt', { session: false }), deletelocation);
router.post('/:_id', passport.authenticate('jwt', { session: false }), updatelocation);



module.exports = router;


function getdojos(req,res) {
    

    
    var viewname = 'vudojonames';

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


function addlocation(req, res){

    var valid = !validator.isEmpty(JSON.stringify(req.body));
    valid = validator.isJSON(JSON.stringify(req.body));
    valid = valid && validator.isDecimal(req.body.lat.toString());
    valid = valid && validator.isDecimal(req.body.lon.toString());


    var stringPromises = [  validatorService.validString(req.body.name, 50),
                            validatorService.validString(req.body.city, 45),
                            validatorService.validString(req.body.zipcode, 4),
                            validatorService.validString(req.body.address, 45),
                            validatorService.validString(req.body.building, 80),
                            validatorService.locTypeIsValid(req.body.locationtype)];
    var allPromiseValid = false;

    Q.allSettled(stringPromises)
    .then(promiseResults => {
        allPromiseValid =  promiseResults.reduce((all, elem) => all && elem.value, true);

    })
    .then(() => authLoginService.getDecodedToken(req))
    .then(token => validatorService.isDojocho(token.pid))
    .then(isDojocho => {

        if(valid && allPromiseValid && isDojocho){ 

            locationservice.addlocation(req)
            .then(function(data){
              res.status(200).send(data);
            })
            .catch(function (err) {
              res.status(400).send(JSON.stringify(err));
            });
        }else{
            res.status(400).send({message:"Please send valid data."});
            //Notify client to send valid data.
        }
    })
    .catch(err => {
        res.sendStatus(400).send(err);
    });
}


function updatelocation(req, res){ 

    var valid = !validator.isEmpty(JSON.stringify(req.body));
    valid = validator.isJSON(JSON.stringify(req.body));
    valid = valid && validator.isInt(req.body.ID.toString());
    valid = valid && validator.isDecimal(req.body.lat.toString());
    valid = valid && validator.isDecimal(req.body.lon.toString());


    var stringPromises = [  validatorService.validString(req.body.name, 50),
                            validatorService.validString(req.body.city, 45),
                            validatorService.validString(req.body.zipcode, 4),
                            validatorService.validString(req.body.address, 45),
                            validatorService.validString(req.body.building, 80),
                            validatorService.locTypeIsValid(req.body.locationtype)];
    var allPromiseValid = false;

    Q.allSettled(stringPromises)
        .then(promiseResults => {
            allPromiseValid =  promiseResults.reduce((all, elem) => all && elem.value, true);

        })
        .then(() => authLoginService.getDecodedToken(req))
        .then(token => validatorService.isDojocho(token.pid))
        .then(isDojocho => {
            if(valid && allPromiseValid && isDojocho) { 

                locationservice.updatelocation(req)
                .then(function(data){
                    var message = ''.concat(data, ' helyszín frissítve.');
                  res.sendStatus(204).send({message : message});
                })
                .catch(function (err) {
                    logger.info('err: ' + JSON.stringify(err));
                  res.sendStatus(400).send(err);
                });
            } else {
                res.status(400).send({message:'Érvénytelen adat vagy nincs jogosultság!'});
            }
        })
        .catch(err => {logger.info(JSON.stringify(err));
            res.sendStatus(400).send(err);
        });

}

function deletelocation(req, res) {
    
    var valid = validator.isInt(req.params._id.toString());

    authLoginService.getDecodedToken(req)
        .then(token => {return validatorService.isDojocho(token.pid)})
        .then(isDojocho => {

            if(valid && isDojocho) {
                locationservice.deletelocation(req.params._id)
                .then(function () {
                    res.sendStatus(200);
                })
                .catch(function (err) {
                    res.status(400).send(JSON.stringify(err));
                });
            } else {
                res.status(400).send({message : "Érvénytelen beérkező adat!"});
            }
        })
        .catch(err => {
            res.status(400).send(JSON.stringify(err));
          });
}