var BadmingtonEvents   = require('../models/badmintonEvents'); // get our mongoose model
var config = require('../config'); // get our config file

var express = require('express'), 
    router = express.Router();

//we want to let clients create a user via POST method
//require('./POST_createUser')(router); 

//when user gives ur "localhost:6680"..it comes here
require('./GET_')(router); 					//
require('./POST_init')(router);  			//when a page is loaded, we find the next event to display


require('./POST_registerAttendee')(router); //put potential attendee into the db
require('./GET_register')(router);  		// when potential attendee clicks on email link to register

require('./GET_send_reminder')(router); 

module.exports = router;
