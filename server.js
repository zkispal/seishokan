require('rootpath')();
const _ = require("lodash");
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const fs = require('fs');
const knexconfig = require ('server/knexconfig.json')
const knex = require('knex')(knexconfig);
const router = express.Router();
const authloginctrl = require('server/api/authlogin.controller');
const datactrl = require('server/api/data.controller');
const locationctrl = require('server/api/location.controller');
const eventctrl = require('server/api/event.controller');



const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader("authorization");
jwtOptions.secretOrKey = fs.readFileSync('server/private-key.key').slice(31,1673); //Extract the pure private key


var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {

    knex('User').where({id:jwt_payload.uid}).then((person) =>  {
        if (person) {
            next(null, person);
          } else {
            next(null, false);
          }

    });
});

passport.use(strategy);

var app = express();
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(router);

app.use(express.static(path.join(__dirname, 'dist')));


app.use('/authlogin', authloginctrl);
app.use('/location', locationctrl);
app.use('/data', datactrl);
app.use('/event', eventctrl);




app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html')); // load our public/index.html file
});




var port = process.env.NODE_ENV === 'production' ? 80 : 3000;

var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});




