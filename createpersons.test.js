function createPersons(req) { // IMPROVE add transaction handling
  var deferred = Q.defer();

  // Check if persons to be added already exists. If exists reject request
  req.body["persons"].forEach(val => {
    knex('person').where({lastname:val.lastname,
                          firstname:val.firstname,
                          dateofbirth:val.dateofbirth}).select('ID')
                  .then((res) => {
                    if (res[0].length > 0){
                      deferred.reject('Person: ' + val.firstname +' '+ val.lastname +' already taken.');
                    }
                  })
                  .catch((err) => {deferred.reject(err);});
  });


  if (!deferred.isRejected()){

    var firstPerson = omitempty(_.omit(_.head(req.body["persons"]), 'roleID'));
    knex('person').insert(firstPerson) //Insert the first person into the db.
                  .then((pid) => {
                    knex("User").where('ID', getUidFromToken(req.auth.header))
                    .update('personid',pid[0])
                    .catch((err) =>{deferred.reject(err);}); //Update User table with the personID just received

                    req.body.persons[0]["roleID"].forEach(elem => { //Update roles for the person
                      var roleRecords =[];
                      roleRecords.push({'personID':pid[0], 'roleID':elem});
                      knex("roles").insert(roleRecords).catch((err) =>{deferred.reject(err);});
                    });

                    if(req.body["persons"].length > 1){

                      for (i=1; i < req.body["persons"].length; i++){
                        var kidRecord = _.omit(req.body.persons[i],'roleID');
                        kidrecord.parentID = pid[0];
                        knex('person').insert(kidRecord) // Insert each kid into Person table
                                      .then((kidpid) => {  //IMPROVE:what if roleid array has more than 1 element?
                                        knex("roles").insert({'personID':kidpid[0], 'roleID':req.body.persons[i].roleid[0]}) // Update roles table with kid
                                                    .catch((err) => {deferred.reject(err);});
                                      })
                                      .catch((err) => {deferred.reject(err);});
                      }
                    }
                  })
                  .catch((err) =>{deferred.reject(err);});
  }

  if (!deferred.isRejected()){
    var token = createToken(getUidFromToken(req.header.authorization));
    deferred.resolve({token:token});
  }

  return deferred.promise;
}
