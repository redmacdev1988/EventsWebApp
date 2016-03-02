
var BadmintonEvents = require('../models/badmintonEvents');


module.exports = function(router){

	/*
	** When a user clicks on the registration link from their email
	** They will be cliking on http://ipaddress:port/register via GET
	** The email, event key, and SHA password be passed via the url
	*/

	router.get('/ie_test_send', function(req, res) {

		//GET url's data
		console.log("key: " 	+ req.query.key);   // sha key
		console.log("email: " 	+ req.query.email); //email of the attendee
		console.log("event:" 	+ req.query.event); //event table name

		var registered = false;

		 BadmintonEvents.findOne({ attendees_table_name: req.query.event }, function(err, foundEvent) {

		 	res.send("<h3>Registration Success!</h3>");

		 }); //findOne

	}); //router

}