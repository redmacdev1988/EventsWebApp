
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config'); // get our config file

var User   = require('../../models/user'); // get our mongoose model

module.exports = function(router){

	//data to change is stored in x-www-form-urlencoded POST key/value
	//email "rtsao@uci.edu"
	//password "compaq"

	//Authenticates a user
	//POST http://localhost:8080/users/authenticate

	//returns token
	router.post('/authenticate', function(req, res) {

		console.log('POST_authenticate.js - email value: ' + req.body.email);
		console.log('POST_authenticate.js - password value: ' + req.body.password);

	  User.findOne({
	    email: req.body.email
	  }, function(err, user) {


	  	try {
		    if (err) throw err;

		    if (!user) {
		      res.json({ success: false, message: 'Authentication failed. Email not found.' });
		    } 
		    else if (user) 
		    {

		    	//user with that name is returned...we just have to check if the pwds match

		      // check if password matches
		      if (user.password != req.body.password) {
		        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		      } 
		      else 
		      {

		      	console.log('POST_authenticate.js - email found, and password is correct');
		        // if user is found and password is right
		        
		        //You can give each user a JWT token that will last a minute
		        // and when a request with expired token arrives, you simply issue them a new one.


		        // create a token, jsonwebtoken to create the token.
		        var token = jwt.sign(user, config.secret, {
		          expiresInMinutes: 2 // expires in 24 hours
		        });

		        // return the information including token as JSON
		        res.json({
		          success: true,
		          message: 'Enjoy your token!',
		          token: token
		        });
		      }   
		    } //if elseif
		} //try
	    catch(err) {
	    	console.log('POST_authenticate.js err:' + err);
	    }


	  });
	});



}