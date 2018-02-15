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


router.post('/authenticate', authenticate);
router.post('/updateperson', updateperson);
router.post('/registerperson', registerperson);
router.get('/getPidFromToken', getPidFromToken);
module.exports = router;

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader("authorization");
jwtOptions.secretOrKey =fs.readFileSync('server/private-key.key').slice(31,1673); //Extract the pure private key




function authenticate(req, res){

    if(validatorService.usernameIsValid(req.body.username) &&
      validatorService.passwordIsValid(req.body.password)){ 

      authLoginService.authenticate(req)
        .then(function(token){
          res.status(200).send(token);
        })
        .catch(function (err) {
          res.status(401).send(JSON.stringify(err));
        });
    }else{
        res.status(401).json({message:"Please send username and/or password"});
        //Notify client to send username and/or password.
    }
}



function registerperson (req, res){
    //Ensure all data is received from client

  if( validator.isJSON(JSON.stringify(req.body)) ){                        // &&
                                    // validatorService.usernameIsValid(req.body.username) &&
                                    //  validatorService.passwordIsValid(req.body.password) &&
                                    //  validator.isEmail(req.body.email)
     authLoginService.createPerson(req)
        .then(function(user){
          res.status(200).send(user);
        })
        .catch(function (err) {
          res.status(400).send(JSON.stringify(err));
        });

  }else{
        res.status(400).send({message:"Bad data received"});

  }
}

function updateperson(req,res) {

  if(true){ //TO DO test validators
    authLoginService.createPerson(req)
      .then((token) => res.status(200).send(token))
      .catch((err) => res.status(400).send(JSON.stringify(err)))
  }else{
    res.status(400).send({message:"Bad data received"});
  }



}

function getPidFromToken(req,res){

if(true){
  authLoginService.getPidFromToken(req)
  .then((pid) => res.status(200).send(pid))
  .catch((err) => res.status(400).send(JSON.stringify(err)))
}else{

  res.status(400).send({message:"Bad data received"});
}



}

