require('rootpath')();
const Q = require('q');
const eventservice = require ('server/service/event.service');
const dataservice = require ('server/service/data.service');
const express = require('express');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('event.controller');



router.get('/geteventtypes', geteventtypes);
router.get('/getevents', getevents);
router.get('/getallevents', getallevents);
router.get('/getfutureexams', getfutureexams);
router.get('/getpractice', getpractice);
router.post('/addevent', addevent);
router.post('/register', register);
router.post('/unregister', unregister);
router.delete('/:_id', deleteevent);
router.put('/:_id', updateevent);
router.get('/getreginfo/:_id', getreginfo);
router.post('/addpractice', addpractice);
router.post('/addattendance', addattendance);
router.get('/getpracticeregs/:_id', getpracticeregs);
router.get('/getpracticeregnames/:_id', getpracticeregnames);
router.get('/geteventregs/', geteventregs);
router.get('/geteventregnames/:_id', geteventregnames);
router.get('/getexamhistory/:_id', getexamhistory);
router.post('/approveattendance/:_id', approveattendance);
router.get('/getexamyears/', getexamyears);
router.get('/getpastexams/:_id', getpastexams);
router.get('/getexamregnames/:_id', getexamregnames);
router.post('/updateexam/:_id', updateExamResult);
router.post('/getpracticehistory/:_id', getpracticehistory);


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