/* jslint node: true */

/* jshint esversion: 6 */

"use strict";

// model for us to do db manipulation
const BadmintonEvents 	= require("../models/badmintonEvents");
const config 			= require("../config"); // get our config file

// for encrypting our user data
const sha256 			= require("crypto-js/sha256");

// gun mail configs
const mailGunAPIKEY 	= "api:key-b44d014234e4765a45f20fae0c1f8b2e";
const emailFromAddress 	= `'Badminton Events Coordinator ${config.ADMIN_EMAIL}'`;
const emailSubject 		= "'Please complete your Badminton registration'";

// child process to send email
const exec = require("child_process").exec;

function tomorrow() {
	const today = new Date();
	let dd = today.getDate() + 1;
	let mm = today.getMonth() + 1;
	const yyyy = today.getFullYear();

	if (dd < 10) {
		dd = `0${dd}`;
	}
	if (mm < 10) {
		mm = `0${mm}`;
	}
	return `${yyyy}-${mm}-${dd}`;
}

function encryptUserInfo(email) {
	return sha256(`${email}-${config.secret}`);
}

function createAttendeeObjectOnStack(newEmail, newEncryption) {
	const falseBoolean = false;
	return {
		email: newEmail,
		sha: newEncryption,
		registered: falseBoolean,
	};
}

function buildRegisterLink(configObj, newAttendeeObj, newEventObj, linkText) {
	const key 	= `key=${newAttendeeObj.sha}`;
	const email = `email=${newAttendeeObj.email}`;
	const event = `event=${newEventObj.attendees_table_name}`;
	const url 	= `${configObj.ip}:${configObj.port}/register?${key}&${email}&${event}`;
	return `<a href=${url}>${linkText}</a>`;
}

function buildEmailMessage(nextEventObj, linkHTML) {
	const link 				= `Please click on link to register for events: ${linkHTML}`;
	const date 				= `<h5>${nextEventObj.date.toLocaleDateString()}</h5>`;
	const description 		= `<i>${nextEventObj.description}</i>`;
	const imgDescription	= "<p> Attached are img maps (eng and ch) to the location</p>";
	return `'${link}${date}${description}${imgDescription}'`;
}

function buildSendMailGunEmailUnixCmd(mailgunAPIKey, senderAddress, recipientAddress,
																	subject, message) {
	const curl 			= `curl -s --user ${mailgunAPIKey} \ `;
	const service 		= " https://api.mailgun.net/v3/sandbox9b1911d791c44508bf512fe20c4404d8.mailgun.org/messages \ ";
	const from      	= `-F from=${senderAddress} \ `;
	const to 			= `-F to=${recipientAddress}@epam.com \ `;
	const theSubject	= `-F subject=${subject} \ `;
	const messageHTML	= `--form-string html=${message} \ `;
	const mapEN			= `-F attachment=@${config.ROOT_PATH}images/map_en.jpg \ `;
	const mapZH			= `-F attachment=@${config.ROOT_PATH}images/map_zh.jpg`;

	return `${curl}${service}${from}${to}${theSubject}${messageHTML}${mapEN}${mapZH}`;
}

function spawnChildProcessToExecuteUnixCommmand(unixCommand, success) {
	exec(unixCommand, (error) => {
		if (error !== null) {
			console.log(`POST_registerAttendee.js - exec error: ${error}`);
			success(false);
		} else {
			success(true);
		}
	});
}

const asyncEventSaveCallBack = function (err, newAttendee, nextEvent, responseObj) {
	if (err) {
		console.log(`POST_registerAttendee.js - uh oh, error ! ${err}`);
		responseObj.send(err);
		return;
	}

	console.log("POST_registerAttendee.js - attendee saved to DB with no error");
	const buildLink = buildRegisterLink(config, newAttendee, nextEvent, "click here");

	console.log("POST_registerAttendee.js - registration a href link built");
	const message = buildEmailMessage(nextEvent, buildLink);

	console.log("POST_registerAttendee.js - email message built");
	const sendEmailUnixCmd = buildSendMailGunEmailUnixCmd(mailGunAPIKEY,
															emailFromAddress,
															newAttendee.email,
															emailSubject,
															message);

	console.log("POST_registerAttendee.js - unix curl string built");
	spawnChildProcessToExecuteUnixCommmand(sendEmailUnixCmd, (success) => {
		if (success) {
			responseObj.json({ message: `email sent to user ${newAttendee.email}` });
		} else {
			responseObj.json({ message: `uh oh, problem sending email to user ${newAttendee.email}` });
		}
		return;
	}); // spawn child process
};

module.exports = (router) => {
	router.post("/registerAttendee", (req, res) => {
		console.log("POST_registerAttendee.js - /registerAttendee reached");
		const email = req.body.email;

		BadmintonEvents.find({ date: { $gte: new Date(tomorrow()) } }, (err, upcomingEvents) => {
			console.log(`POST_registerAttendee.js - # of upcoming events: ${upcomingEvents.length}`);

			upcomingEvents.sort((a, b) => {
				return new Date(a.date) - new Date(b.date);
			});

			// get the earliest next event..and work off of that one
			const nextEvent = upcomingEvents[0];
			const UTCZoneOffset = nextEvent.date.getTimezoneOffset();

			nextEvent.date.setMinutes(nextEvent.date.getMinutes() + UTCZoneOffset);
			console.log(`next event: ${nextEvent.date}`);

			if (!nextEvent) {
				res.json({ success: false, message: "Event not found." });
				return;
			} else if (nextEvent) {
				// the event already has attendees
				if (nextEvent.attendees) {
					console.log(`registerAttendee.js - # attendees for event:${nextEvent.attendees.length}`);

					// first let's check to see if email exists in all these attendees
					for (let i = 0; i < nextEvent.attendees.length; i++) {
						if (nextEvent.attendees[i].email === email) {
							console.log("POST_registerAttendee.js - EMAIL ALREADY EXISTS!");
							res.json({ success: false, message: "EMAIL_EXISTS" });
							return;
						}
					}

					// everything is ok....so let's process the attendee

					// create the attendee on the stack
					const newAttendee = createAttendeeObjectOnStack(email, encryptUserInfo(email));

					// push the object into our attendees array
					nextEvent.attendees.push(newAttendee);

					// then just save
					nextEvent.save(asyncEventSaveCallBack(err, newAttendee, nextEvent, res));
				} // check attendees attribute
			} // if valid Event found
		}); // findOne
	}); // /registerAttendee
};
