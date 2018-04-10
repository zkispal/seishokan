require('rootpath')();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const Q = require('q');
const _ = require('lodash');
const omitempty= require ('omit-empty');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);
const passport = require("passport");
const passportJWT = require("passport-jwt");
const log4js = require('log4js');
const logger = log4js.getLogger('authlogin.service');



 const ExtractJwt = passportJWT.ExtractJwt;
 const JwtStrategy = passportJWT.Strategy;

 var jwtOptions = {};
 jwtOptions.jwtFromRequest = ExtractJwt.fromHeader("authorization");
 jwtOptions.secretOrKey = fs.readFileSync('server/private.key').slice(31,1673); //Extract the pure private key



var authloginservice = {};

authloginservice.authenticate = authenticate;
authloginservice.register = register;
authloginservice.getDecodedToken = getDecodedToken;




module.exports = authloginservice;

function register(req){
    var deferred = Q.defer();
    var reqbody = req.body;
    logger.info('inside register ' + JSON.stringify(req.body));
    knex.select('ID', 'username').from('Person').where('username', req.body.username)
        .then(founduser => {

          if(founduser.length === 0){

            insertPerson(req)
            .then(id => {
              createToken(id)
              .then(token => {

                assemblyUser(id, token)
                .then(user => {logger.info(JSON.stringify(user));
                   deferred.resolve(user); })
                .catch(function(err){

                  deferred.reject(err);
                });
              })
              .catch(function(err){

                deferred.reject(err);
              });
            
            })
            .catch(function(err){

              deferred.reject(err);
            });

          }
          else{
            var message = ''.concat('A ', req.body.username,' felhasználónév már foglalt.')
            deferred.reject({message : message});
          }
        })
        .catch(function(err){
          logger.info(JSON.stringify(err));
          deferred.reject(err);
        });
    return deferred.promise;
}


function authenticate(req) {
  var deferred = Q.defer();

  knex('Person').where('username', req.body.username).select('ID', 'passhash')
  .then((res) => {

    if(bcrypt.compareSync(req.body.password, res[0].passhash)){

      createToken(res[0].ID)
      .then(token => {
         assemblyUser(res[0].ID, token)
        .then(user => deferred.resolve(user))
        .catch ((err) => {deferred.reject(err);} );          
      })
      .catch ((err) => {deferred.reject(err);} );
    } else {
      deferred.reject({message : 'Hibás felhasználónév vagy jelszó'});
    }
  })
  .catch((err) => {deferred.reject(err);});

  return deferred.promise;
}


function insertPerson(req){

  var deferred = Q.defer();

  var computedpasshash = bcrypt.hashSync(req.body.password, 10);
  var DoB = new Date(parseInt(req.body.dateofbirth, 10));
  var practiceStartDate = new Date(parseInt(req.body.practicestart, 10));

  var personRecord = {username:req.body.username,
                      passhash:computedpasshash,
                      email:req.body.email,
                      dateofbirth:DoB,
                      practicestart:practiceStartDate,
                      rankID:req.body.rankID,
                      homedojoID:req.body.homedojoID,
                      firstname:req.body.firstname,
                      lastname:req.body.lastname};
  var personID = 0;
  knex.transaction(trx => {

    return trx.insert(personRecord).into('Person')
              .then(pid => {

                personID = pid[0];
                var roleRecords = req.body.roleID.map(elem => _.assign({personID:pid[0], roleID:elem}));

                return trx.insert(roleRecords).into('roles');
              })

  })
  .then(dbresp => {deferred.resolve(personID); })
  .catch(err => { deferred.reject(err);} );

  return deferred.promise;
}


function createToken(_pid) { 

  var deferred = Q.defer();

  var JWTPayload = {pid :_pid,
                    rol : [],
                    pof : []};  // start populating payload

    knex('Roles').select('roleid').where('personID', _pid)
    .catch((err) => {deferred.reject(err);})
    .then((res)=>{

        JWTPayload.rol = res.map(elem => elem.roleid);

        knex('Person').select('ID').where('parentid', _pid)
        .catch((err) => {deferred.reject(err);})
        .then((kids) => {

          JWTPayload.pof = kids.map(elem => elem.ID)

          var token = jwt.sign(JWTPayload, jwtOptions.secretOrKey, {expiresIn: '1d'}); //Create token
          deferred.resolve(token);

        })
    });
    return deferred.promise;
}


function assemblyUser(pid, token) {
  var deferred = Q.defer();

  var User = {ID:pid,
              lastname:'',
              firstname:'',
              role:[],
              token:token};
  knex('Person').where('ID', pid).select('firstname', 'lastname')
  .then(dbresp => {

    User.lastname = dbresp[0].lastname;
    User.firstname = dbresp[0].firstname;

    knex('vupersonsroles').where('personID', pid)
    .then(roledata => {

      User.role = roledata.map(elem => elem.rolename);

      deferred.resolve(User);
    })
    .catch(err => deferred.reject(err));
  })
  .catch(err => deferred.reject(err));

  return deferred.promise;
}

function getDecodedToken(req) {
  var deferred = Q.defer();
  
  var authheader = req.headers.authorization;
  
  
    if (authheader.split(' ')[0] === 'Bearer'){
        var token = authheader.split(' ')[1];
  
        var decodedToken;
        decodedToken = jwt.verify(token,jwtOptions.secretOrKey);
  
        //return decodedToken;
        deferred.resolve(decodedToken);
        
    }else{
      //return 0;
     deferred.reject();
    }
  
  return deferred.promise;
  }
