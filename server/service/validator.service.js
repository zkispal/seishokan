require('rootpath')();
const validator = require('validator');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);



const eighteenYrs = Date(567993600000); //18 yrs in msec
const thirtyTwoYrs = Date(1009843200000);//32 yrs in msec
const hundredTwentyYrs = Date(3786912000000); //120 yrs in millisec
const uglyChars = ['<', '>', '!', '{', '}', '(', ')', '§', '/', '\'', '\$', '\\'];

var validatorservice = {};

validatorservice.usernameIsValid = usernameIsValid;
validatorservice.passwordIsValid = passwordIsValid;
validatorservice.practStartDateIsValid = practStartDateIsValid;
validatorservice.bDayIsValid = bDayIsValid;
validatorservice.rankIDIsValid = rankIDIsValid;
validatorservice.homeDojoIDIsValid = homeDojoIDIsValid;
validatorservice.nameIsValid = nameIsValid; //to check firstname and lastname
validatorservice.roleIDsIsValid = roleIDsIsValid;
//TO DO validatorservice.parentIDsIsValid = parentIDsIsValid when a parent registers another kid and the recived JSON has only one element
module.exports = validatorservice;

function usernameIsValid(username)  {

  var valid = false;

  valid = (username === username.trim());
  //No trailing spaces in username.

  valid = valid && (validator.isLength(username, {min:6, max: 45}));
  // Username should be between 6 and 45 characters.

  valid = valid && (validator.isAlphanumeric(username) || validator.isEmail(username));
  // Only letters and numbers in username or email address used.

  return valid;
}

function passwordIsValid(password) {

  var valid = false;

  valid = (validator.isLength(password, {min:6}));
  // Minimum password length 6.

  return valid;
}

function bDayIsValid(bday, isParent) {

  var valid = false;

  valid = (bday === bday.trim()); //No trailing spaces in date sting.

  valid = valid && (!validator.isAfter(bday) &&  //check if it is a valid date and bday not in the future
           (validator.toDate(bday) > Date.now()-hundredTwentyYrs )); //check if bday is in the past 120 years

  if (isParent){
    valid = valid && (validator.toDate(bday)< Date.now()- eighteenYrs); // We expect who registers as parent are over 18
  }

  return valid;
}

function practStartDateIsValid(psd){

  var valid = false;

  valid = (psd === psd.trim()); //No trailing spaces in date sting.

  valid = valid && (!validator.isAfter(psd) &&  //check if it is a valid date and practice start date is not in the future
        (validator.toDate(psd) > Date.now()-thirtyTwoYrs )); //check if practice start date  is in the past 32 years

  return valid;
}

function rankIDIsValid(rankid, isaikidoka) {

  var valid = false;

  if (!isaikidoka) {
    return valid = validator.isEmpty(rankid); // If not aikidoka it should be empty
  }

  valid = valid && validator.isInt(rankid); //Ensure rankid is integer

  knex.select('ID').from('Rank') //Check if rank id is within valid range
      .then(function (res){

        function equalTo(value) {
          return value === rankid;
          }

        valid = valid && res.some(equalTo);
      })
      .catch(function(err){ // if we cannot check in the database return false
        return valid=false;
      })

  return valid;
}

function homeDojoIDIsValid(homedojoid, isaikidoka) {

  var valid = false;

  if (!isaikidoka) {
    return valid = validator.isEmpty(homedojoid); // If not aikidoka it should be empty
  }

  valid = validator.isInt(homedojoid); //Ensure homedojo is integer

  knex.select('ID').from('Location').where('locationtype', 'Dojo')
      .then(function(res){

         function equalTo(value) {
          return value === homedojoid;
          }

          valid = valid && res.some(equalTo); //check if received homedojoid exists in DB
        }
      )
      .catch(function(err){ // if we cannot check in the database return false
        return valid=false;
      })

  return valid;
}

function roleIDsIsValid(roles) {

  var valid = false;

  valid = (roles.length > 0); //Shouldn't be an empty array

  roles.foreach(function(element){
      valid = valid && validator.isInt(element); //All rolesids should be an integer
  });

  knex.select('ID').from('Role') //All element of roles array should exist in DB
      .then(function (res) {
        valid = valid && arrayContainsArray(res,roles);
      })
      .catch(function(err){
        return valid = false;
      });

//Helper function to check if all elements of an array exists in an other array
function arrayContainsArray (superset, subset) {
    if (0 === subset.length) {
      return false;
      }
    return subset.every(function (value) {
      return (superset.indexOf(value) >= 0);
      });
    }

  return valid;

}

function nameIsValid(name, maxlen){

  var valid = false;

  valid = !validator.isEmpty(name);

  valid = valid && (2 <= name.length  <= maxlen);//should be between 2 and @param maxlen characters

  valid = valid && validator.isAlpha(name, 'hu-HU'); //Should contain only Hungarian characters

  uglyChars.forEach(function (elem){
    valid = valid && !validator.contains(name,elem); // No special characters in name
  })

  return valid;

}
