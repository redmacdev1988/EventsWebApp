
//model for us to do db manipulation
var BadmintonEvents 		= require('../models/badmintonEvents');
var config 		= require('../config'); // get our config file

var mailGunAPIKEY 			= 'api:key-b44d014234e4765a45f20fae0c1f8b2e';
var fromAddress 			= "'Badminton Events App<Ricky_Tsao@epam.com>'";
var eventCoordinatorEmail 	= "'Ricky_Tsao@epam.com'";

var exec 					= require('child_process').exec;

function Tomorrow() {

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	return yyyy + "-" + mm + "-" + dd;
}


module.exports = function(router){

	// route to show a random message (GET http://localhost:6680/)
	router.get('/email_to_admin', function(req, res) {

		console.log("GET_email_to_admin.js -- LET'S GET THE RESULTS from the event");
		//write email to evonne's address

		console.log("GET_email_to_admin.js - tomorrow is: " + Tomorrow());
		
		//first, find an event date is that later than tomorrow
		BadmintonEvents.findOne( { "date": { '$gte': new Date( Tomorrow() )}}, 
			function(err, latestEvent){

			//found EVENT DATE later than TOMORROW 

			console.log('GET_email_to_admin.js - - ------ recevied event --------');


			//now we just have to figure out if its before DEADLINE_HOUR
			//get current time
			var today = new Date(); // for now
			var eventDate = latestEvent.date;

			var event_is_within_seconds 	= Math.abs( (eventDate.getTime() - today.getTime()) / 1000 );
			var event_is_within_minutes 	= Math.abs( event_is_within_seconds / 60 );
			var event_is_within_hours 		= Math.abs( event_is_within_minutes / 60 );

			var UTCZoneOffset = today.getTimezoneOffset();
			console.log("GET_email_to_admin.js - - offset is: " + UTCZoneOffset); // in minutes

			var hours_until_event = UTCZoneOffset/60 + event_is_within_hours;

			console.log("GET_email_to_admin.js - - abs(event - today) in hours is: " + hours_until_event);

			//check to see if we're are within ONE day of the event. This is a constant and a must.
			if(hours_until_event < 24) {


				var hour 	= today.getHours();
				var minute 	= today.getMinutes();
				var UTCZoneOffset = today.getTimezoneOffset();

				console.log("GET_email_to_admin.js - - hour is: "+ hour + ", minute is: " + minute);
				console.log("GET_email_to_admin.js - - offset is: " + UTCZoneOffset); // in minutes

				// //0.05 is 3 minutes so WE WANT TO SAY if the hour is more than the deadline hour but less than 
				// //3 minutes past
				if(hour >= config.EVENT_DEADLINE_HOUR 
					&& minute < config.EVENT_DEADLINE_MINUTE) {

					//send the email to the admin
					console.log("GET_email_to_admin.js -IT IS EQUAL OR within " 
									+ config.EVENT_DEADLINE_MINUTE 	+ " minutes of " 
									+ config.EVENT_DEADLINE_HOUR 	+ ", let's send the admin email");

					/////////
					if(!latestEvent) {
						res.json({ success: false, message: 'Event not found.' });
					}
					//next event found
					else {
						console.log("GET_email_to_admin.js - We are within 1 day of the event. SEND THE REMINDER!");

						var eventDate 		 	= latestEvent.date;
						console.log(eventDate.toLocaleDateString());
						var eventDescription = latestEvent.description;
						var subject	= "'Attendees for " + eventDate.toLocaleDateString() + " event, " + eventDescription + "'";
						console.log("GET_email_to_admin.js - number of attendess: " + latestEvent.attendees.length);

						var htmlAttendees = "<ol>";
						for( var i = 0; i < latestEvent.attendees.length; i++) {

							if(latestEvent.attendees[i].registered === true) { //if registered is yes

								htmlAttendees += "<li>";
								htmlAttendees += "<i>" + latestEvent.attendees[i].email	+ "@epam.com</i> ";
								htmlAttendees += "</li>";
							}
						} //for loop

						htmlAttendees += "</ol>";
						var message = "<h5>List of Attendees</h5> <span>" 
										+ eventDate.toLocaleDateString() 
										+ "</span>" + htmlAttendees;

							message += "<br /> Description: " + eventDescription;

						var sendEmail = "curl -s --user " 		+ mailGunAPIKEY + " \ "
						    + " https://api.mailgun.net/v3/sandbox9b1911d791c44508bf512fe20c4404d8.mailgun.org/messages \ "
						    + "-F from=" 			+ fromAddress + " \ "
						    + "-F to=" 				+ eventCoordinatorEmail + " \ "
						    + "-F subject=" 		+ subject + " \ "
						    + "--form-string html='" + message + "'";

					    console.log("sendEmail var: " + sendEmail);

		    			// sends the email
						var child = exec(sendEmail, function (error, stdout, stderr) {

						  if (error !== null) {
						    console.log('GET_email_to_admin.js - exec error: ' + error);
						    res.json({ message: "ERROR: "+ error });
						    return;
						  }
						  else {
						  	res.json({ message: "Results successfully emailed to admin" });
						  	return;
						  }
						});

					} //else

					////////
					return;
				}
				else 
				{
					console.log("We are within " 
									+ config.EVENT_DEADLINE_WITHIN_HOURS  	
									+ " hours of the event, but its not within "
									+ config.EVENT_DEADLINE_MINUTE 	+ " minutes of " 
									+ config.EVENT_DEADLINE_HOUR 	+ " O'clock yet");

					res.json({message: "We are within " 
									+ config.EVENT_DEADLINE_WITHIN_HOURS		+ " hours of the event, but its not within " 
									+ config.EVENT_DEADLINE_MINUTE 	+ " minutes of " 
									+ config.EVENT_DEADLINE_HOUR 	+ " O'clock yet"});
				}
			}
			else {
				console.log("We are NOT within " + config.EVENT_DEADLINE_WITHIN_HOURS + " hours of the event");
				res.json({message: "We are NOT within " + config.EVENT_DEADLINE_WITHIN_HOURS + " hours of the event"});
				return;
			}


		}); //findOne

	}); //router /results

}