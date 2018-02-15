require('rootpath')();
const Q = require('q');
const eventservice = require ('server/service/event.service');
const dataservice = require ('server/service/data.service');
//const knexconfig = require ('server/knexconfig.json');
//const knex = require('knex')(knexconfig);
const express = require('express');
const router = express.Router();



router.get('/geteventtypes', geteventtypes);
router.get('/getevents', getevents);
router.get('/getallevents', getallevents);
router.get('/getexams', getexams);
router.post('/addevent', addevent);
router.post('/register', register);
router.post('/unregister', unregister);
router.delete('/:_id', deleteevent);
router.put('/:_id', updateevent);
router.get('/getreginfo/:_id', getreginfo);
router.post('/addpractice', addpractice);


module.exports = router;


function geteventtypes(req,res) {
    var viewname = 'vueventtypes';

    dataservice.getview(viewname)
    .then(function(eventtypes){
        res.status(200).send(eventtypes);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}

function getevents(req,res) {

     var viewname = 'vuevents';

    dataservice.getview(viewname)
    .then(function(events){
        res.status(200).send(events);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}

function getallevents(req,res) {

    var viewname = 'vuallevents';

   dataservice.getview(viewname)
   .then(function(events){
       res.status(200).send(events);
   })
   .catch(function(err){
       res.status(400).send(err);
   }); 
}

function getexams(req,res) {

    var viewname = 'vuexams';

   dataservice.getview(viewname)
   .then(function(events){
       res.status(200).send(events);
   })
   .catch(function(err){
       res.status(400).send(err);
   }); 
}

function addevent(req, res){ //TO DO Validation

    if(true){ 

        eventservice.addevent(req)
        .then(function(data){
          res.status(200).send(data);
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    }else{
        res.status(400).json({message:"Please send valid data."});
        //Notify client to send valid data.
    }
}

function register(req, res){ //TO DO Validation

    if(true){ 

        eventservice.register(req)
        .then(function(data){
          res.status(200).send(data);
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    }else{
        res.status(400).json({message:"Please send valid data."});
        //Notify client to send valid data.
    }
}

function unregister(req, res){ //TO DO Validation

    if(true){ 

        eventservice.unregister(req)
        .then(function(data){
          res.sendStatus(200).send(data);
        })
        .catch(function (err) {
            console.log(err);
          res.status(400).send(err);
        });
    }else{
        res.status(400).json({message:"Please send valid data."});
        //Notify client to send valid data.
    }
}

function deleteevent(req, res) {
    eventservice.deleteevent(req.params._id)
        .then(function (resp) {
            console.log(resp);
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(400).send(err);
        });
}

function updateevent(req, res){ //TO DO Validation
 

    if(true){ 

        eventservice.updateevent(req)
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

function getreginfo(req,res) {
   
    eventservice.getreginfo(req.params._id)
    .then(function(reginfo){
        res.status(200).send(reginfo);
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}

function addpractice(req,res) { //TO DO  only Dojocho, validation of input
    
    eventservice.addpractice(req)
    .then(function(srvresp){
        res.status(200).send(JSON.stringify(srvresp));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}