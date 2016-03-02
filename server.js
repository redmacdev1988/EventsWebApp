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

/*

// When a function is created, a keyword called this is created (behind the scenes), 
// which links to the object in which the function operates.

function Test2() {
	
	var self = this; // this refers to the global object, because it is the global scope
	// that owns this function

	//this is used as private
    this.name = "Jabba the Hut"; // this will be bound to the global object.
    console.log("Test2() Constructor: " + this.name);

    return {
    	//if we want to use this as public, we have to use self

        growls : function(phrase) {
        	// this refers to the object that's bound to this function
            console.log(self.name + " yells out " + phrase);
            console.log(this.name + " yells out " + phrase); //ryu
            //refers to 'this' of the invoking object pointer on the stack
        },

        //
        growls2 : (phrase) => {
        	console.log(this.name + " yells out " + phrase); //jabba 
        	//refers to 'this' of the lexical scope, which is our private 'this' that's on the heap

        }
    };
}

var t2 = Test2(); //own attribute
t2.name = "Ryu..";
t2.growls("hadoken");
t2.growls2("shoooo ryu ken!");

console.log('global.name: ' + global.name);


*/


/*
const car = {

	type: "bmw",
	color: "white"
};

function changeCar(carObj) {

	if('type' in carObj) {
		carObj.type = "honda";
	}
}

changeCar(car);

console.log(car.type);
console.log(car.color);
*/


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

