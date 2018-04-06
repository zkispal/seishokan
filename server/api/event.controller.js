require('rootpath')();
const Q = require('q');
const eventservice = require ('server/service/event.service');
const dataservice = require ('server/service/data.service');
const express = require('express');
const passport = require("passport");
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('event.controller');



router.get('/geteventtypes', passport.authenticate('jwt', { session: false }), geteventtypes);
router.get('/getevents', passport.authenticate('jwt', { session: false }), getevents);
router.get('/getallevents', passport.authenticate('jwt', { session: false }), getallevents);
router.get('/getfutureexams',passport.authenticate('jwt', { session: false }),  getfutureexams);
router.get('/getpractice', passport.authenticate('jwt', { session: false }), getpractice);
router.post('/addevent', passport.authenticate('jwt', { session: false }), addevent);
router.post('/register', passport.authenticate('jwt', { session: false }), register);
router.post('/unregister', passport.authenticate('jwt', { session: false }), unregister);
router.delete('/:_id', passport.authenticate('jwt', { session: false }), deleteevent);
router.put('/:_id', passport.authenticate('jwt', { session: false }), updateevent);
router.get('/getreginfo/:_id', passport.authenticate('jwt', { session: false }), getreginfo);
router.post('/addpractice', passport.authenticate('jwt', { session: false }), addpractice);
router.post('/addattendance', passport.authenticate('jwt', { session: false }), addattendance);
router.get('/getpracticeregs/:_id', passport.authenticate('jwt', { session: false }), getpracticeregs);
router.get('/getpracticeregnames/:_id', passport.authenticate('jwt', { session: false }), getpracticeregnames);
router.get('/geteventregs/', passport.authenticate('jwt', { session: false }), geteventregs);
router.get('/geteventregnames/:_id', passport.authenticate('jwt', { session: false }), geteventregnames);
router.get('/getexamhistory/:_id', passport.authenticate('jwt', { session: false }), getexamhistory);
router.post('/approveattendance/:_id', passport.authenticate('jwt', { session: false }), approveattendance);
router.get('/getexamyears/', passport.authenticate('jwt', { session: false }), getexamyears);
router.get('/getpastexams/:_id', passport.authenticate('jwt', { session: false }), getpastexams);
router.get('/getexamregnames/:_id', passport.authenticate('jwt', { session: false }), getexamregnames);
router.post('/updateexam/:_id', passport.authenticate('jwt', { session: false }), updateExamResult);
router.post('/getpracticehistory/:_id', passport.authenticate('jwt', { session: false }), getpracticehistory);


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


function getpractice(req,res) {


    logger.info('param start: ' + req.params.start);
    logger.info('param locid: ' + req.params.locID);
    logger.info('query start: ' + req.query.start);
    logger.info('query locid: ' + req.query.locID);
   eventservice.getpractice(req.query.start, req.query.locID)
   .then(function(practices){
       res.status(200).send(JSON.stringify(practices));
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

function getfutureexams(req,res) {

    var viewname = 'vufutureexams';

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

function addattendance(req,res) { //TO DO  validation of input
   
    eventservice.addattendance(req)
    .then(function(srvresp){
        res.status(200).send(JSON.stringify(srvresp));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}


function getpracticeregs(req,res) {
   
    eventservice.getpracticeregs(req.params._id)
    .then(function(reginfo){
        res.status(200).send(JSON.stringify(reginfo));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}


function geteventregs(req,res) {
   
    eventservice.geteventregs()
    .then(function(reginfo){
        res.status(200).send(JSON.stringify(reginfo));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}


function getpracticeregnames(req,res) {
   
    var viewname = 'vupracticeregnames';
    eventservice.getregnames(req.params._id, viewname)
    .then(function(reginfo){
        res.status(200).send(JSON.stringify(reginfo));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}


function geteventregnames(req,res) {
   
    var viewname = 'vueventregnames';
    eventservice.getregnames(req.params._id, viewname)
    .then(function(reginfo){
        res.status(200).send(JSON.stringify(reginfo));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}

function getexamhistory(req,res) {
   
    var viewname = 'vuexamhistory';
    dataservice.getviewSelectByID(req.params._id, viewname)
    .then(function(resp){
        res.status(200).send(JSON.stringify(resp));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}


function approveattendance(req,res) {
   
    eventservice.approveattendance(req)
    .then(function(srvresp){
        res.status(200).send(JSON.stringify(srvresp));
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}

function getexamyears(req,res) {
   
    eventservice.getexamyears(req)
    .then(function(srvresp){
        res.status(200).send(JSON.stringify(srvresp));
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
}

function getpastexams (req,res) {

    eventservice.getpastexams(req.params._id)
    .then(function(srvresp){
        res.status(200).send(JSON.stringify(srvresp));
    })
    .catch(function(err){
        res.status(400).send(err);
    }); 
  
}


function getexamregnames(req,res) {
   
    var viewname = 'vuexamregnames';
    eventservice.getregnames(req.params._id, viewname)
    .then(function(reginfo){
        res.status(200).send(JSON.stringify(reginfo));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}

function updateExamResult (req, res) {

    if (req.body.attendancetype === 'Sikertelen') {
        eventservice.updateExamResult(req)
        .then(function(srvresp){
            res.status(200).send(JSON.stringify(srvresp));
        })
        .catch(function(err){
            res.status(400).send(JSON.stringify(err));
        });
    } else {
        eventservice.updateExamResultRank(req)
        .then(function(srvresp){
            res.status(200).send(JSON.stringify(srvresp));
        })
        .catch(function(err){
            res.status(400).send(JSON.stringify(err));
        });

    }
}

function getpracticehistory (req, res) {

    eventservice.getpracticehistory(req)
    .then(function(history){
        res.status(200).send(JSON.stringify(history));
    })
    .catch(function(err){
        res.status(400).send(JSON.stringify(err));
    }); 
}