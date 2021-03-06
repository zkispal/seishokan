require('rootpath')();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require('bcrypt');
const validator = require('validator');
const fs = require('fs');
const Q = require('q');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);
const authLoginService = require('server/service/authlogin.service');
const validatorService = require('server/service/validator.service');
const express = require('express');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('authlogin.controller');


router.post('/authenticate', authenticate); // No JWT authentication as it needs for authentication.
router.post('/passwordchange', passwordChange);
router.post('/registerperson', registerperson); // No JWT authentication as it needs for registration.

module.exports = router;

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader("authorization");
jwtOptions.secretOrKey =fs.readFileSync('server/private.key').slice(31,1673); //Extract the pure private key




function authenticate(req, res){

  var valid = validator.isJSON(JSON.stringify(req.body));

  valid = valid && !validator.isEmpty(req.body.username);

  valid = valid && !validator.isEmpty(req.body.password);


  var validatorPromises = [ validatorService.usernameExists(req.body.username),
                            validatorService.usernameIsValid(req.body.username),
                            validatorService.passwordIsValid(req.body.password)];

  Q.allSettled(validatorPromises)
    .then(promiseResults => {
      logger.info('promiseResults: ' + JSON.stringify(promiseResults));
      var allPromiseValid = promiseResults.reduce((all, elem) => all && elem.value, true);

      logger.info('valid: ' + valid);
      logger.info('allPromiseValid ' + allPromiseValid);

      if(valid &&  allPromiseValid) {

        authLoginService.authenticate(req)
          .then(function(token){
            res.status(200).send(token);
          })
          .catch(function (err) {

            res.status(401).send(JSON.stringify(err));
          });
      }else{
        logger.info('else ág: ')
          res.status(401).json({message:"Please send username and/or password"});
          //Notify client to send username and/or password.
      }
    })
    .catch(function (err) {
      logger.info('catch ág: ' + JSON.stringify(err))
      res.status(401).send(JSON.stringify(err));
    });

}

function passwordChange(req, res) {

  var valid = validator.isJSON(JSON.stringify(req.body));

  var validatorPromises = [ validatorService.passwordIsValid(req.body.password),
                            validatorService.passwordIsValid(req.body.newpass)];

  Q.allSettled(validatorPromises)
    .then( promiseResults => {
      var allPromiseValid = promiseResults.reduce((all, elem) => all && elem.value, true);

      if (valid && allPromiseValid) {

        authLoginService.changePassword(req)
        .then((resp) => {
          res.status(200).send();
        })
        .catch( (err) => {
          res.status(400).send(JSON.stringify(err));
        });
      } else {
        res.status(400).send({message: 'Érvénytelen jelszó'});
      }
    })
    .catch( (err) => {
      res.status(400).send(JSON.stringify(err));
    });
}

function registerperson (req, res){
    //Ensure all data is received from client
 
    var valid = validator.isJSON(JSON.stringify(req.body));
    valid =valid && validator.isEmail(req.body.email); 

    var validatorPromises = [ validatorService.nameIsValid(req.body.firstname, 25),
                              validatorService.nameIsValid(req.body.lastname, 100),
                              validatorService.usernameIsValid(req.body.username),
                              validatorService.passwordIsValid(req.body.password),
                              validatorService.bDayIsValid(req.body.dateofbirth),
                              validatorService.practStartDateIsValid(req.body.practicestart),
                              validatorService.dojoIDIsValid(req.body.homedojoID),
                              validatorService.rankIDIsValid(req.body.rankID),
                              validatorService.roleIDsIsValid(req.body.roleID)];


     Q.allSettled(validatorPromises)
      .then(promiseResults => { 
        logger.info('Validator promise result: ' + promiseResults.toString);

        var allPromiseValid = promiseResults.reduce((all, elem) => all && elem.value, true);

        if ( valid && allPromiseValid ) {                      

          authLoginService.register(req)
            .then(function(user){
              res.status(200).send(user);
            })
            .catch(function (err) {
              logger.info(JSON.stringify(err))
              res.status(400).send(JSON.stringify(err));
            });
      
        } else {
          res.status(400).send({message:'Hibás regisztrációs adat!'});
        }

      })                         
      .catch(function (err) {
        res.status(400).send(JSON.stringify(err));
      });

}
