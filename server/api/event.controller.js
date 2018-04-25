require('rootpath')();
const Q = require('q');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const validatorService = require('server/service/validator.service');
const authLoginService = require('server/service/authlogin.service');
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
router.post('/addattendancereg', passport.authenticate('jwt', { session: false }), addattendancereg); 
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

function addevent(req, res){ 
    logger.info(JSON.stringify(req.body));
    var valid = validator.isJSON(JSON.stringify(req.body));

    valid = valid && validator.isInt(req.body.eventtypeID.toString())
        && validator.isInt(req.body.locationID.toString())
        && validator.isISO8601(req.body.start.toString())
        && validator.isISO8601(req.body.end.toString());



    validatorService.validString(req.body.name, 50)
        .then(nameIsValid => {
            valid = valid && nameIsValid;

        })
        .then(() => {
            return authLoginService.getDecodedToken(req);
        })
        .then(token => {
            return validatorService.isDojocho(token.pid);
        })
        .then(isDojocho => {
 
            if(valid && isDojocho){ 

                eventservice.addevent(req)
                .then(function(data){
                  res.status(200).send(data);
                })
                .catch(function (err) {
                  res.status(400).send(err);
                });
            }else{
                res.status(400).send({message:"Érvénytelen adat."});
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
          });

}

function register(req, res){ 

    var valid = validator.isJSON(JSON.stringify(req.body))
        && validator.isInt(req.body.eventID.toString())
        && validator.isInt(req.body.attendeeID.toString())
        && validator.isAlpha(req.body.attendancetype);
 
    
    authLoginService.getDecodedToken(req)
        .then(token => {return validatorService.isAikidoka(token.pid)})
        .then(isAikidoka => {

            if(valid && isAikidoka){ 

            eventservice.register(req)
            .then(function(data){
              res.status(200).send(data);
            })
            .catch(function (err) {
              res.status(400).send(err);
            });
        }else{
            res.status(400).json({message:"Please send valid data."});
    
        }})
        .catch(function (err) {
            res.status(400).send(err);
          });

}

function unregister(req, res){ 

    var valid = validator.isJSON(JSON.stringify(req.body))
        && validator.isInt(req.body.eventID.toString())
        && validator.isInt(req.body.attendeeID.toString())
        && validator.isAlpha(req.body.attendancetype);

    authLoginService.getDecodedToken(req)
        .then(token => {return validatorService.isAikidoka(token.pid)})
        .then(isAikidoka => {   
            
            if(valid && isAikidoka){ 

            eventservice.unregister(req)
            .then(function(data){
              res.sendStatus(200).send(data);
            })
            .catch(function (err) {
              res.status(400).send(err);
            });
            } else {
                res.status(400).json({message:"Please send valid data."});
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteevent(req, res) {

    var valid = validator.isInt(req.params._id.toString());


    authLoginService.getDecodedToken(req)
        .then(token => {return validatorService.isDojocho(token.pid) })
        .then(isDojocho => {

            if (valid && isDojocho) {

                eventservice.deleteevent(req.params._id)
                .then(function (resp) {
                    console.log(resp);
                    res.sendStatus(200);
                })
                .catch(function (err) {
                    console.log(err);
                    res.sendStatus(400).send(err);
                });
            } else {
                res.status(400).json({message:"Hibás beérkezett adat!"});
            }
        })
        .catch(function (err) {
            res.status(400).send();
        });
}

function updateevent(req, res){ 

    var valid = validator.isJSON(JSON.stringify(req.body));

    valid = valid && validator.isInt(req.body.eventtypeID.toString())
        && validator.isInt(req.body.ID.toString())
        && validator.isInt(req.body.locationID.toString())
        && validator.isISO8601(req.body.start.toString())
        && validator.isISO8601(req.body.end.toString());
   
    validatorService.validString(req.body.name, 50)
        .then(nameIsValid => {
            valid = valid && nameIsValid;
        })
        .then(() => {
            return authLoginService.getDecodedToken(req);
        })
        .then(token => {
            return validatorService.isDojocho(token.pid);
        })
        .then(isDojocho => {

            if(valid && isDojocho){ 

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
            } 
        })
        .catch(function (err) {
            res.status(400).send();
        });
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

function addpractice(req,res) { 
logger.info('req.body: ' + JSON.stringify(req.body));
    var valid = !validator.isEmpty(JSON.stringify(req.body));
logger.info(valid);
    valid = valid && validator.isJSON(JSON.stringify(req.body));
    logger.info(valid);
    valid = valid    && validator.isInt(req.body.eventtypeID.toString());
    logger.info(valid);
    valid = valid    && validator.isInt(req.body.locationID.toString());
    logger.info(valid);
    valid = valid    && req.body.timerange.every(validator.isISO8601);
    logger.info(valid);
    valid = valid     && validator.isIn(req.body.practicelength.toString(), ['45', '60', '90']);
    logger.info(valid);
    valid = valid    && req.body.weekdayID.map(elem => elem.toString()).every(validator.isInt);
    logger.info(valid);

    authLoginService.getDecodedToken(req)
        .then(token => {
            return validatorService.isDojocho(token.pid);
        })
        .then(isDojocho => {
            if (valid && isDojocho) {

                eventservice.addpractice(req)
                .then(function(srvresp){
                    res.status(200).send(JSON.stringify(srvresp));
                })
                .catch(function(err){
                    res.status(400).send(JSON.stringify(err));
                }); 
            } else {
                res.status(400).json({message: 'Nem elfogadható adatbevitel'});
            }
        })
        .catch(function (err) {
            res.status(400).send(JSON.stringify(err));
        });
}


function addattendance(req,res) { 
    var valid = !validator.isEmpty(JSON.stringify(req.body));
    valid = valid && validator.isJSON(JSON.stringify(req.body));
    valid = valid && req.body.every(elem => validator.isInt(elem.eventID.toString()));
    valid = valid && req.body.every(elem => validator.isAlpha(elem.attendancetype));
    valid = valid && req.body.every(elem => validator.isInt(elem.attendeeID.toString()));
    valid = valid && req.body.every(elem => validator.isInt(elem.instructorID.toString()));

    authLoginService.getDecodedToken(req)
    .then(token => {return validatorService.isInstructor(token.pid)})
    .then(isInstructor => {
        if (valid && isInstructor) {
            eventservice.addattendance(req)
            .then(function(srvresp){
                res.status(200).send(JSON.stringify(srvresp));
            })
            .catch(function(err){
                logger.info(err);
                res.status(400).send(JSON.stringify(err));
            }); 
    
        } else {
            res.status(400).send({message : 'Érvénytelen adat!'});
        }
    })
    .catch(function (err) {
        res.status(400).send(JSON.stringify(err));
    });

}


function addattendancereg(req,res) {
    var valid = !validator.isEmpty(JSON.stringify(req.body));
    valid = valid && validator.isJSON(JSON.stringify(req.body)); 
    valid = valid && validator.isInt(req.body.eventID.toString());
    valid = valid && validator.isAlpha(req.body.attendancetype);
    valid = valid && validator.isInt(req.body.attendeeID.toString());
    valid = valid && validator.isInt(req.body.instructorID.toString());

    authLoginService.getDecodedToken(req)
    .then(token => {return validatorService.isAikidoka(token.pid)})
    .then(isAikidoka => {
        if (valid && isAikidoka) {
            eventservice.addattendance(req)
            .then(function(srvresp){
                res.status(200).send(JSON.stringify(srvresp));
            })
            .catch(function(err){
                res.status(400).send(JSON.stringify(err));
            }); 
    
        } else {
            res.status(400).send({message : 'Érvénytelen adat!'});
        }
    })
    .catch(function (err) {
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

    var valid = validator.isJSON(JSON.stringify(req.body));
    valid = valid && validator.isInt(req.params._id.toString());
    req.body.forEach(elem => {
        valid = valid && validator.isInt(elem.ID.toString());
    });
    req.body.forEach(elem => {
        valid = valid && validator.isBoolean(elem.attended.toString());
    });

    authLoginService.getDecodedToken(req)
        .then(token => {return validatorService.isInstructor(token.pid)})
        .then(isInstructor => {

            if(valid && isInstructor) {

                eventservice.approveattendance(req)
                .then(function(srvresp){
                    res.status(200).send(JSON.stringify(srvresp));
                })
                .catch(function(err){
                    logger.info(JSON.stringify(err));
                    res.status(400).send(err);
                });

            } else {
                res.status(400).send('Send valid data');
            }
        })
        .catch(function(err){
            logger.info(JSON.stringify(err));
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


    var valid = validator.isJSON(JSON.stringify(req.body))
        && validator.isInt(req.params._id.toString())
        && validator.isInt(req.body.ID.toString())
        && validator.isInt(req.body.rankID.toString())
        && validator.isAlpha(req.body.attendancetype)
        && validator.isAlphanumeric(req.body.certno);


    authLoginService.getDecodedToken(req)
        .then(token => {return validatorService.isDojocho(token.pid)})
        .then(isDojocho => {
            if (valid && isDojocho){
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
            }else {
                res.status(400).send('Invalid input');
            }
        })
        .catch(function(err) {
            res.status(400).send(JSON.stringify(err))
        });
}

function getpracticehistory (req, res) {
    var valid = validator.isJSON(JSON.stringify(req.body)); // Check if we received a valid JSON

    req.body.forEach(element => { // Check if all element of the received array is a number
        valid = valid && validator.isInt(element.toString());
    });

    var isSamePerson = false;

    authLoginService.getDecodedToken(req)
        .then(token => { logger.info('token' + JSON.stringify(token));
            isSamePerson =  req.params._id === token.pid.toString(); // Check if the request id for own data
        return validatorService.isAikidoka(token.pid);})
        .then(isAikidoka =>{
            logger.info('isAikidoka ' + isAikidoka);
            //logger.info('token2' + JSON.stringify(token));
            logger.info('valid if előtt ' + valid);
            if (valid && isAikidoka && isSamePerson) { 

                eventservice.getpracticehistory(req)
                .then(function(history){
                    res.status(200).send(JSON.stringify(history));
                })
                .catch(function(err){
                    res.status(400).send(JSON.stringify(err));
                }); 
            } else {
                res.status(400).send({message : 'Érvénytelen bejövő adat!'});
            }
        } )
        .catch(function(err){
            res.status(400).send(JSON.stringify(err));
        });
}