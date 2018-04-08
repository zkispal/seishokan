require('rootpath')();
const validator = require('validator');
const Q = require('q');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);
const datefns = require ('date-fns');
const _ = require ('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('validator.service');



const uglyChars = ['<', '>', '!', '{', '}', '(', ')', '§', '/', '\'', '\$', '\\'];

var validatorservice = {};

validatorservice.usernameIsValid = usernameIsValid;
validatorservice.usernameExists = usernameExists;
validatorservice.passwordIsValid = passwordIsValid;
validatorservice.practStartDateIsValid = practStartDateIsValid;
validatorservice.bDayIsValid = bDayIsValid;
validatorservice.rankIDIsValid = rankIDIsValid;
validatorservice.dojoIDIsValid = dojoIDIsValid;
validatorservice.nameIsValid = nameIsValid; //to check firstname and lastname
validatorservice.roleIDsIsValid = roleIDsIsValid;
validatorservice.isAikidoka = isAikidoka;
validatorservice.isInstructor = isInstructor;
validatorservice.isDojocho = isDojocho;
validatorservice.validString = validString;

module.exports = validatorservice;

function usernameIsValid(username)  {
  var deferred = Q.defer();

  var valid = false;

  valid = (username === username.trim());
  //No trailing spaces in username.

  valid = valid && (validator.isLength(username, {min:6, max: 45}));
  // Username should be between 6 and 45 characters.

  valid = valid && (validator.isAlphanumeric(username) || validator.isEmail(username));
  // Only letters and numbers in username or email address used.
  deferred.resolve(valid);
  return deferred.promise;
}

function usernameExists(username)  {
  var deferred = Q.defer();

  knex('person').select('ID').where('username', username)
    .then(dbresp => {
      logger.info('dbresp: ' + JSON.stringify(dbresp));
      logger.info('dbresp.length: ' + dbresp.length);
      var exists = dbresp.length === 1;
      deferred.resolve(exists);
    })
    .catch(err => deferred.reject(err));

  return deferred.promise;
}


function passwordIsValid(password) {
  var deferred = Q.defer();
  var valid = false;

  valid = (validator.isLength(password, {min:6}));
  // Minimum password length 6.
  deferred.resolve(valid);
  return deferred.promise;
}

function bDayIsValid(bday) {
  var deferred = Q.defer();
  var valid = false;

  valid = validator.isNumeric(bday.toString()); // Check if it is a number that we can cast into a date

  const birthday = new Date(bday);

  valid = valid && datefns.isBefore(birthday, new Date()); //check if  bday not in the future

  valid = valid && datefns.differenceInCalendarYears(birthday, new Date()) < 120; //check if bday is in the past 120 years

  deferred.resolve(valid);
  return deferred.promise;
}

function practStartDateIsValid(psd){
  var deferred = Q.defer();
  var valid = false;

  valid = validator.isNumeric(psd.toString()); // Check if it is a number that we can cast into a date

  const practStartDate = new Date(psd);

  valid = valid && datefns.isBefore(practStartDate, new Date()); //check if it is a valid date and practice start date is not in the future
        
  valid = valid && datefns.differenceInCalendarYears(practStartDate, new Date()) < 40; //check if practice start date  is in the past 40 years
  
  deferred.resolve(valid);
  return deferred.promise;
}

function rankIDIsValid(rankid) {
  var deferred = Q.defer();
  var valid = false;

  valid = validator.isNumeric(rankid.toString()); //Ensure rankid is integer

  //Check if rank id is within valid range
  knex.select('ID').from('rank')
      .map(dbresp => dbresp.ID) // Transform array of object to array of values
      .then( data => {
        valid = valid && _.includes(data, parseInt(rankid, 10));

        deferred.resolve(valid);
      })
      .catch(function(err){ // if we cannot check in the database return false
        deferred.reject(err);
      })
      return deferred.promise;
}

function dojoIDIsValid(homedojoid) {
  var deferred = Q.defer();

  var valid = false;

  valid = validator.isNumeric(homedojoid.toString()); //Ensure homedojo is integer


  knex('location').select('ID').where('locationtype', 'Dojo')
      .map(dbresp => dbresp.ID)    
      .then( data => {

        valid = valid && _.includes(data, parseInt(homedojoid, 10));
 
        deferred.resolve(valid);
      })
      .catch(function(err){ // if we cannot check in the database return false
        valid = false;
        deferred.reject(valid);
      })

  return deferred.promise;
}

function roleIDsIsValid(roles) {
  var deferred = Q.defer();
  var valid = false;

  valid = (roles.length > 0); //Shouldn't be an empty array
  logger.info('valid after length check: ' + valid);

  roles.forEach(function(element){
    logger.info('element in foreach: ' + element);
      valid = valid && validator.isInt(element.toString()); //All rolesids should be an integer
      logger.info('valid in foreach: ' + valid);
  });

  knex.select('ID').from('Role')
      .map(dbresp => dbresp.ID) //All element of roles array should exist in DB
      .then(function (resp) {
        logger.info(JSON.stringify(resp));
        var arrayInArray = arrayContainsArray(resp,roles);
        logger.info('arrayInArray: ' + arrayInArray);
        valid = valid && arrayInArray
        logger.info('valid within knex then: ' + valid);
        deferred.resolve(valid);
      })
      .catch(function(err){
        deferred.reject(valid = false);
      });

      return deferred.promise;

}

function nameIsValid(name, maxlen){
  var deferred = Q.defer();
  var valid = false;

  valid = !validator.isEmpty(name);

  valid = valid && !findOne(name, uglyChars);
  
  valid = valid && validator.isLength(name, {min:2, max: maxlen});//should be between 2 and @param maxlen characters

  if ( _.includes(name, '-')) {
    var nameparts = name.split('-'); // if name contains a hyphen then split the name
    // by the hyphen and ensure the individual pieces are Hungarian characters only
    nameparts.forEach(elem => {
      valid = valid && validator.isAlpha(elem, 'hu-HU');
      deferred.resolve(valid);
  });

  } else { 

    // if name doesn't include hyphen then ensure Hungarian characters only
    valid = valid && validator.isAlpha(name, 'hu-HU');
    deferred.resolve(valid);
  }
  
  return deferred.promise;

}

function isAikidoka(id) {
  var deferred = Q.defer();

  var isAikidoka = false;

  knex.from('roles').innerJoin('role', 'roles.roleID', 'role.ID')
      .select('roles.personID')
      .where('role.rolename', 'Aikidoka')
      .map(dbresp => dbresp.personID)
      .then(pids => {

        isAikidoka = _.includes(pids, id);
        deferred.resolve(isAikidoka);

      })
      .catch(err =>  {deferred.reject(err);});

  return deferred.promise;
}

function isInstructor(id) {
  logger.info(id);
  var deferred = Q.defer();

  var isInstructor = false;

  knex.from('roles').innerJoin('role', 'roles.roleID', 'role.ID')
      .select('roles.personID')
      .where('role.rolename', 'Instructor')
      .orWhere('role.rolename', 'Assistant')
      .map(dbresp => dbresp.personID)
      .then(pids => {
        logger.info(pids);
        isInstructor = _.includes(pids, id);
        deferred.resolve(isInstructor);

      })
      .catch(err => deferred.reject(err));
      
  return deferred.promise;
}


function isDojocho(id) {
  var deferred = Q.defer();

  var isDojocho = false;

  knex.from('roles').innerJoin('role', 'roles.roleID', 'role.ID')
      .select('roles.personID')
      .where('role.rolename', 'Dojocho')
      .map(dbresp => dbresp.personID)
      .then(pids => {
        
        isDojocho = _.includes(pids, id);
        deferred.resolve(isDojocho);

      })
      .catch(err => deferred.reject(err));

  return deferred.promise;
}


function validString(_string, maxlen) {
  var deferred = Q.defer();
  
  var valid = false;

  valid = !validator.isEmpty(_string);

  valid = valid && !findOne(_string, uglyChars);
  
  valid = valid && validator.isLength(_string, {min: 1, max: maxlen});

  deferred.resolve(valid);
   
  return deferred.promise;
  
}


//Helper function to check if all elements of an array exists in an other array
function arrayContainsArray (superset, subset) {
  if (0 === subset.length) {
    return false;
    }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
    });
  } 
//Helper function to check if any elements of an array exists in an other array
  var findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};