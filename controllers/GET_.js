/* jslint node: true */

/* jshint esversion: 6 */

"use strict";

module.exports = function (router) {
	router.get("/", (req, res) => {
		res.json({ message: "EPAM Events App. Copyright EPAM 2016" });
	});
};
