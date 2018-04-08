require('rootpath')();
const Q = require('q');
const dataservice = require ('server/service/data.service');
const authLoginService = require('server/service/authlogin.service');
const validatorService = require('server/service/validator.service');
const knexconfig = require ('server/knexconfig.json');
const knex = require('knex')(knexconfig);
const express = require('express');
const passport = require("passport");
const validator = require('validator');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('data.controller');



router.get('/getadultranks', getadultranks); // No JWT authentication as it needs for registration.
router.get('/getroleid/:_role', getroleid);
router.get('/getweekdays', passport.authenticate('jwt', { session: false }), getweekdays);
router.get('/getpracticetypes', passport.authenticate('jwt', { session: false }), getpracticetypes);
router.get('/getsempais', passport.authenticate('jwt', { session: false }), getsempais);
router.get('/getinstructors', passport.authenticate('jwt', { session: false }), getinstructors);
router.get('/getpromotableroles', passport.authenticate('jwt', { session: false }), getpromotableroles);
router.get('/getroleholders/:_id', passport.authenticate('jwt', { session: false }), getroleholders);
router.delete('/roleholders/:_id', passport.authenticate('jwt', { session: false }), delroleholders); //Validation done
router.post('/roleholders/', passport.authenticate('jwt', { session: false }), updtroleholders); //Validation done


module.exports = router;


function getadultranks(req,res) {

    var viewname = 'vuadultranks';

    dataservice.getview(viewname)
    .then(function(ranks){
        res.status(200).send(ranks);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function getroleid (req,res) {
    dataservice.getroleid(req.params._role)
    .then(function(id){
        res.status(200).send(id);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function getweekdays(req,res) {

    var viewname = 'vuweekdays';

    dataservice.getview(viewname)
    .then(function(weekdays){
        res.status(200).send(weekdays);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function getpracticetypes(req,res) {

    var viewname = 'vupracticetypes';

    dataservice.getview(viewname)
    .then(function(practicetypes){
        res.status(200).send(practicetypes);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function getsempais(req,res) {

    var viewname = 'vusempais';

    dataservice.getview(viewname)
    .then(function(sempais){
        res.status(200).send(sempais);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function getinstructors(req,res) {

    var viewname = 'vuinstructors';

    dataservice.getview(viewname)
    .then(function(sempais){
        res.status(200).send(sempais);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function getpromotableroles(req,res) {

    var viewname = 'vupromotableroles';

    dataservice.getview(viewname)
    .then(function(roles){
        res.status(200).send(roles);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function getroleholders(req,res) {

    dataservice.getroleholders(req.params._id)
    .then(function(personnames){
        res.status(200).send(personnames);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}


function delroleholders(req,res) {
    
    var valid = validator.isInt(req.params._id.toString());

    authLoginService.getDecodedToken(req)
        .then(token => { validatorService.isDojocho(token.pid)})
        .then(isDojocho => {
            if (valid && isDojocho) {

                dataservice.delroleholders(req.params._id)
                .then(function(dbres) {
                    res.status(200).send(JSON.stringify(dbres));
                })
                .catch(function(err){
                    res.status(400).send(JSON.stringify(err));
                }); 
            } else {
                res.status(400).send({message : 'Érvénytelen input vagy nincs jogosultság!'});
            }
        })
        .catch(err => {res.status(400).send(JSON.stringify(err)); });




}


function updtroleholders(req,res) { 

    var valid = validator.isJSON(JSON.stringify(req.body));

    valid = valid && req.body.every(elem => validator.isInt(elem.personID.toString()));
    valid = valid && req.body.every(elem => validator.isInt(elem.roleID.toString()));

    authLoginService.getDecodedToken(req)
        .then(token => validatorService.isDojocho(token.pid))
        .then(isDojocho => {
            if(valid && isDojocho) {
                dataservice.updtroleholders(req)
                .then(function(dbres) {
                    res.status(200).send(JSON.stringify(dbres));
                })
                .catch(function(err){
                    res.status(400).send(JSON.stringify(err));
                }); 
            }
        })
        .catch(function (err) {
            res.status(400).send(JSON.stringify(err));
          });

}
