/* jslint node: true */
/* jshint esversion: 6 */

"use strict";

// model for us to do db manipulation
const BadmintonEvents 			= require("../models/badmintonEvents");
const config 					= require("../config");

// const mailGunAPIKEY 			= "api:key-b44d014234e4765a45f20fae0c1f8b2e";
// const fromAddress 				= "'Badminton Events App<Ricky_Tsao@epam.com>'";
// const eventCoordinatorEmail 	= "'Ricky_Tsao@epam.com'";

const exec 						= require("child_process").exec;

function tomorrow() {
	const today = new Date();
	let dd 		= today.getDate();
	let mm 		= today.getMonth() + 1; // January is 0!
	const yyyy 	= today.getFullYear();

	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${yyyy}-${mm}-${dd}`;
}

function formattedDate(date) {
	let hours 		= date.getHours();
	let minutes 	= date.getMinutes();
	const ampm 		= hours >= 12 ? "pm" : "am";
	hours 			= hours % 12;

	if (hours === 0) {
		hours = 12;
	}

	if (minutes < 10) {
		minutes = `0${minutes}`;
	}

	const strTime 	= `${hours}:${minutes} ${ampm}`;
	const month = date.getMonth() + 1;
	return `${month}/${date.getDate()}/${date.getFullYear()} ${strTime}`;
}

// use chron to run this script
module.exports = function (router) {
	router.get("/send_reminder", (req, res) => {
		console.log(`GET_send_reminder.js - tomorrow is:  ${tomorrow()}`);

		// first, find an event date is that later than tomorrow
		BadmintonEvents.findOne({ date: { $gte: new Date(tomorrow()) } },
		(err, latestEvent) => {
			// found EVENT DATE later than TOMORROW
			console.log("GET_send_reminder.js - - ------ recevied event --------");
			// now we just have to figure out if its before DEADLINE_HOUR
			// get current time
			const today 	= new Date(); // for now
			const eventDate = latestEvent.date;

			const eventWithinSeconds	= Math.abs((eventDate.getTime() - today.getTime()) / 1000);
			const eventWithinMinutes 	= Math.abs(eventWithinSeconds / 60);
			const eventWithinHours 		= Math.abs(eventWithinMinutes / 60);

			const UTCZoneOffset 		= today.getTimezoneOffset();
			console.log(`GET_send_reminder.js - - offset is: ${UTCZoneOffset}`); // in minutes
			const hoursUntilEvent = UTCZoneOffset / 60 + eventWithinHours;
			console.log(`hours until event: ${hoursUntilEvent}`);
			console.log(`GET_send_reminder.js - abs(event - today) in hours is: ${hoursUntilEvent}`);

			let listOfAttendees = "";// = "'rtsao6680@gmail.com, caoqijimetis@gmail.com'";

			console.log(`There are ${latestEvent.attendees.length} # of attendees for this event`);

			for (let i = 0; i < latestEvent.attendees.length; i++) {
				if (latestEvent.attendees[i].registered === true) {
					const email = `${latestEvent.attendees[i].email}@epam.com`;
					listOfAttendees += `${email}, `;
				}
			}

			const indexOfLastComma 	= listOfAttendees.lastIndexOf(",");
			listOfAttendees 		= listOfAttendees.substring(0, indexOfLastComma);
			latestEvent.date.setMinutes(UTCZoneOffset);

			const curl 				= `curl -s --user ${config.GUNMAIL_API_KEY} \ `;
			const service 			= " https://api.mailgun.net/v3/sandbox9b1911d791c44508bf512fe20c4404d8.mailgun.org/messages \ ";
			const fromAddress 		= ` -F from='${config.ADMIN_EMAIL}' \ `;
			const toAddress 		= ` -F to='${config.ADMIN_EMAIL}' \ `;
			const cc 				= ` -F cc=${listOfAttendees} \ `;
			const reminderSubject 	= ` -F subject='You have a Badminton Event on ${formattedDate(latestEvent.date)}' \ `;
			const bodyMessage		=
			` --form-string html='<html>Enjoy! Questions? Call ${config.ADMIN_PHONE}</html>' `;
			const sendEmail
			= `${curl}${service}${fromAddress}${toAddress}${cc}${reminderSubject}${bodyMessage}`;

			// sends the email
			exec(sendEmail, (error) => {
				if (error !== null) {
					console.log(`GET_send_reminder.js - exec error:${error}`);
					res.json({ message: `ERROR:  ${error}` });
				} else {
					res.json({ message: `Reminder successfully emailed to: ${listOfAttendees}` });
				}
				return;
			}); // child process to send email
		}); // findOne
	}); // router /results
};
