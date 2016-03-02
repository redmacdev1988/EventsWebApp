/*jslint node: true */
/*jshint esversion: 6 */

// "use strict";

// =======================
// get the packages we need ============
// =======================
var express     = require('express');

var app         = express();

var bodyParser  = require('body-parser');

var morgan      = require('morgan');

var mongoose    = require('mongoose');

var config 		= require('./config'); // get our config file

console.log( "==========================");
console.log( "=== configuration 1.11 ===");
console.log( "==========================");


mongoose.connect(config.database); // connect to database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('server.js - Mongoose database connected to ' + config.database);
});

//app.set(name, value)
//Assigns setting name to application setting : value, 
//where name is one of the properties from the

app.set('superSecret', config.secret); // secret variable


//when running on live server, uncomment below:

/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/


app.use(express.static('public'));

console.log("server.js - public set...");

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log("server.js - bodyParser set...");

app.use(require('./controllers'));
console.log("server.js - controllers set...");

// use morgan to log requests to the console
app.use(morgan('dev'));

app.listen(config.port);
console.log("server.js - listening on port " + config.port);
exports.app = app;

console.log("server.js - setup complete...");

