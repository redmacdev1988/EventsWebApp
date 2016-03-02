/* jslint node: true */

/* jshint esversion: 6 */

"use strict";

const BadmintonEvents = require("../models/badmintonEvents");
const config = require("../config"); // get our config file

// get tomorrow's date yyyy-mm-dd
function tomorrow() {
	const today = new Date();
	let dd = today.getDate() + 1; // get 1 more day ahead

	let mm = today.getMonth() + 1; // January is 0!
	const yyyy = today.getFullYear();

	if (dd < 10) {
		dd = "0${dd}";
	}

	if (mm < 10) {
		mm = "0${mm}";
	}

	return `${yyyy}-${mm}-${dd}`;// yyyy + "-" + mm + "-" + dd;
}

// returns the number of hours from today to the next event
function todayFromNextEvent(today, eventDate) {
	const eventIsWithinSeconds 		= Math.abs((eventDate.getTime() - today.getTime()) / 1000);
	const eventIsWithinMinutes 		= Math.abs(eventIsWithinSeconds / 60);
	const eventIsWithinHours 		= Math.abs(eventIsWithinMinutes / 60);

	console.log("POST_init.js - abs(event - today) in hours is:");
	console.log(`${eventIsWithinHours}`);

	if (eventIsWithinHours < config.EVENT_DEADLINE_WITHIN_HOURS) {
		console.log("POST_init.js - invalid event. Within:");
		console.log(`${config.EVENT_DEADLINE_WITHIN_HOURS}`);
	} else {
		console.log("POST_init.js - valid event.  Within: ");
		console.log(`${config.EVENT_DEADLINE_WITHIN_HOURS}`);
	}

	return eventIsWithinHours;
}


module.exports = (router) => {
	/*
	** Gets run whenever the page is refreshed
	** First, given tomorrow, let's get ALL upcoming events (events that are on or after tomorrow)
	** The next event is the earliest of the upcoming event.
	*/
	// router.post("/init", function (req, res) {
	router.post("/init", (req, res) => {
		console.log("POST_init.js - /init reached");

		BadmintonEvents.find({ date: { $gte: new Date(tomorrow()) } },
		(err, upcomingEvents) => {
			console.log(`POST_init.js - UPCOMING events: ${upcomingEvents.length}`);

			if (upcomingEvents.length === 0) {
				console.log("POST_init.js - exiting with NO_EVENTS");
				res.json({ message: "NO_EVENTS" });
				return;
			}

			upcomingEvents.sort(function (a, b) {
				return new Date(a.date) - new Date(b.date);
			});

			const nextEvent = upcomingEvents[0];
			const today 	= new Date();

			// i.e if deadline is 24 hours within the event, then we do not let people register anymore
			if (todayFromNextEvent(today, nextEvent.date) < config.EVENT_DEADLINE_WITHIN_HOURS) {
				console.log("POST_init.js - event not valid anymore");
				res.json({ message: "REGISTRATION_CLOSED" });
				return;
			}
			// if registration not closed, we'll return the nextEvent info onto the screen
			if (nextEvent) {
				console.log("date: ");
				console.log(`${nextEvent.date}`);
				console.log("description: ");
				console.log(`${nextEvent.description}`);
				console.log("attendees_table_name: ");
				console.log(`${nextEvent.attendees_table_name}`);

				// access res, a global var
				res.json({ data: nextEvent });
			}
		}); // findOne
	});
};
