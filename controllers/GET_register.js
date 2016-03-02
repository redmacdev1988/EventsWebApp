/* jslint node: true */
/* jshint esversion: 6 */

"use strict";

const BadmintonEvents 	= require("../models/badmintonEvents");
const config 			= require("../config");

function saveEvent(event, responseObj) {
	event.save((err) => {
		if (err) {
			console.log(`GET_register.js - uh oh! error in saving: ${err}`);
			responseObj.send(`<h3>Registration Failed</h3><p>Please contact ${config.ADMIN_EMAIL}</p>`);
		} else {
			console.log("GET_register.js - SAVED!!!");
			const title 	= "<h1>Registration Success</h1>";
			const quote 	= "<blockquote>There is nothing else to do</blockquote>";
			const message 	= "<b>We will send you a reminder email before the event</b>";
			const issues	= `<p>If any issues, please contact the admin ${config.ADMIN_EMAIL}</p>`;
			responseObj.send(`${title}${quote}${message}${issues}`);
		}
		return;
	}); // foundEvent save
}


// 0 - n: its a valid registration
// -1: anything nonvalid or already registered is
function attendeeFound(event, toRegisterEmail, toRegisterKey, responseObj) {
	let i = 0;

	// there is >= 1 attendee for this event
	for (i; i < event.attendees.length; i++) {
		if (toRegisterEmail === event.attendees[i].email) {
			console.log("GET_register.js - FOUND THE EMAIL !!");
			// now let's match the sha
			if (toRegisterKey === event.attendees[i].sha) {
				console.log("GET_register.js - SHA MATCHES TOO!...lets register with bool yes");

				if (event.attendees[i].registered === false) {
					event.attendees[i].registered = true;
					console.log("GET_register.js - first time registering...DONE √");
					return i;
				} else {
					console.log("GET_register.js - already registered..√");
					responseObj.send("<h3>Already Registered</h3><p>Enjoy the event!</p>");
					return -1; // don't do anytning
				}
			} // if registered
		} // if email found
	} // for
	return -1;
}


module.exports = function (router) {
    /*
    ** When a user clicks on the registration link from their email
    ** They will be cliking on http://ipaddress:port/register via GET
    ** The email, event key, and SHA password be passed via the url
    */
	router.get("/register", (req, res) => {
		// GET url's data
		console.log(`key: ${req.query.key}`);   // sha key
		console.log(`email: ${req.query.email}`); // email of the attendee
		console.log(`event: ${req.query.event}`); // event table name

		const 	eventStrID 		= req.query.event;
		const 	attendeeEmail 	= req.query.email;
		const 	attendeeKey 	= req.query.key;

		BadmintonEvents.findOne({ attendees_table_name: eventStrID }, (err, foundEvent) => {
			if (foundEvent) {
				console.log(`GET_register.js - number of attendees: ${foundEvent.attendees.length}`);
				if (attendeeFound(foundEvent, attendeeEmail, attendeeKey, res) >= 0) {
					saveEvent(foundEvent, res);
				}
				return;
			} // if event found
		}); // findOne
	}); // router
};
