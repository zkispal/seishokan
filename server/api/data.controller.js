require('rootpath')();
const Q = require('q');
const dataservice = require ('server/service/data.service');
const knexconfig = require ('server/knexconfig.json');
const knex = require('knex')(knexconfig);
const express = require('express');
const router = express.Router();
const log4js = require('log4js');
 
const logger = log4js.getLogger('data.controller');



router.get('/getadultranks', getadultranks);
router.get('/getweekdays', getweekdays);
router.get('/getpracticetypes', getpracticetypes);
router.get('/getsempais', getsempais);
router.get('/getinstructors', getinstructors);
router.get('/getpromotableroles', getpromotableroles);
router.get('/getroleholders/:_id', getroleholders);
router.delete('/roleholders/:_id', delroleholders);
router.post('/roleholders/', updtroleholders);


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
    dataservice.delroleholders(req.params._id)
    .then(function(dbres) {
        console.log('Sent 200' + JSON.stringify(dbres));
        res.status(200).send(JSON.stringify(dbres));
    })
    .catch(function(err){
        console.log('Sent 400' + JSON.stringify(err));
        res.status(400).send(JSON.stringify(err));
    }); 


}


function updtroleholders(req,res) { //TO DO Validation

     if(true) {
        console.log('roleid: ' + JSON.stringify(req.body[0].roleID));
        dataservice.updtroleholders(req)
        .then(function(dbres) {
            console.log('Sent 200' + JSON.stringify(dbres));
            res.status(200).send(JSON.stringify(dbres));
        })
        .catch(function(err){
            console.log('Sent 400 ' + JSON.stringify(err));
            res.status(400).send(JSON.stringify(err));
        }); 

    }
}

