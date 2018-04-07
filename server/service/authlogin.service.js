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
authloginservice.createPerson = createPerson;
authloginservice.getDecodedToken = getDecodedToken;
//authloginservice.updatePerson = updatePerson;



module.exports = authloginservice;

function createPerson(req){
    var deferred = Q.defer();

    knex.select('ID', 'username').from('Person').where('username', req.body.username)
        .then(function (founduser){

          if(founduser.length === 0){
            createPersoninDB();
          }
          else{
            deferred.reject('Username: ' + req.body.username + ' already taken.');
          }
        })
        .catch(function(err){
          deferred.reject(err);
        });
function createPersoninDB(){

            var computedpasshash = bcrypt.hashSync(req.body.password, 10);

            var DoB = new Date(parseInt(req.body.dateofbirth, 10));
            var practiceStartDate = new Date(parseInt(req.body.practicestart, 10));

            knex.insert({username:req.body.username,
                        passhash:computedpasshash,
                        email:req.body.email,
                        dateofbirth:DoB,
                        practicestart:practiceStartDate,
                        rankID:req.body.rankID,
                        homedojoID:req.body.homedojoID,
                        firstname:req.body.firstname,
                        lastname:req.body.lastname}
                      )
                .into('Person')
                .then(function(id){

                  req.body.roleID.forEach(function (elem) {
                    
                    var rolerecord = {personID:id, roleID:elem};

                    knex.insert(rolerecord).into('Roles')
                    .catch((err) => {deferred.reject(err); });
                  });
                  



                  var payload = {pid:id[0]};
                  var token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '1d'});//Create JWT
                  deferred.resolve({token:token});
                })
                .catch((err) => {deferred.reject(err); 

                });
          }

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

function updatePerson(req) { // IMPROVEMENT add transaction handling
  var deferred = Q.defer();


  knex('Person').where({lastname:req.body.lastname, // We assume that the birthdate, firstname, lastname
                        firstname:req.body.firstname,// triplet identifies a person.
                        dateofbirth:req.body.dateofbirth}).select('ID')
  .then((res) => {

    if (res.length === 0){
      updatePersonInDB();
    }else{deferred.reject('Person: ' + req.body.firstname +' '+ req.body.lastname +' already taken.');}
  })
  .catch((err) => {

    deferred.reject(err);});


    function updatePersonInDB(){
      var person = omitempty(_.omit((req.body), 'roleID'));

      knex('Person').insert(person)
      .then((pid) => {


        knex('User').where('ID', getUidFromToken(req)) //Update user table
        .update('personid',pid[0])
        .then(() => {

          req.body["roleID"].forEach(elem =>{
            var roleRecords =[];
            roleRecords.push({'personID':pid[0], 'roleID':elem});
            knex("Roles").insert(roleRecords)
            .then (() =>{
                var token = createToken(getUidFromToken(req.header.auth));

            })
            .catch((err) => {

              deferred.reject(err);});
          })
        })
        .catch((err) => {

          deferred.reject(err);});
      })
      .catch((err) => {

        deferred.reject(err);})

  }



  return deferred.promise;
}


function authenticate(req) {
  var q = Q.defer();

  knex('Person').where('username', req.body.username).select('ID', 'passhash', 'firstname', 'lastname')
  .then((res) => {

      if(bcrypt.compareSync(req.body.password, res[0].passhash)){
 
        createToken(res[0].ID)
        .then(function (token) {

          knex('vupersonsroles').where('personID',res[0].ID)
          .then(function (roledata) {

            var roles =[];
            roledata.forEach(function (elem){
              roles.push(elem.rolename);
            })


            q.resolve({ID:res[0].ID,
              lastname:res[0].lastname,
              firstname:res[0].firstname,
              role:roles,
              token:token});

          })
          .catch ((err) => {q.reject(err);} );          
        })
        .catch ((err) => {q.reject(err);} );
      } else {
        q.reject(err);
      }
  })
  .catch((err) => {q.reject(err);});
    

  return q.promise;
}


function createToken(pid) { // IMPROVEMENT put token creation into a service

    var q = Q.defer();

    var payload = {};
    payload.pid =pid;
    payload.rol =[];
    payload.pof= [];// start populating payload

    knex('Roles').select('roleid').where('personID', pid)
    .catch((err) => {q.reject(err);})
    .then((res)=>{
        
      for (let i=0; i< res.length; i++){
         payload.rol.push(res[i].roleid);
       }

        knex('Person').select('id').where('parentid', pid)
        .catch((err) => {q.reject(err);})
        .then((kids) => {
          for (let i=0; i< kids.length; i++){
            payload.rol.push(res[i].ID);
          }

          var token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '1d'}); //Create token
          q.resolve(token);

        })
    });
    return q.promise;
  }
