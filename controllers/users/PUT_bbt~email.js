var User   = require('../../models/user'); // get our mongoose model

module.exports = function(router){


//BODY(2)
//date         "7_17_2015"
//recordings   array
router.put('/bbt/:user_email', function(req, res) {

	console.log('req.body.recordings: ' + typeof(req.body.recordings));
	console.log('------------- /bbt/' + req.params.user_email + '--------------');
	console.log('req.body.date: ' + typeof(req.body.date));

	if((typeof req.body.recordings !== 'undefined') && (typeof req.body.date !== 'undefined')) {

		console.log('recordings and date are valid');
		console.log('PUT_bbt~email.js - email: ' + req.params.user_email 
			+ ', there are ' + req.body.recordings.length 
			+ ' recording(s) for incoming BBT date ' 
			+ req.body.date);
	}

	User.findOne( { email:req.params.user_email }, function(err,user){

		if (err) throw err;

	    if (!user) 
	    {
	    	res.json({ success: false, message: 'User not found.' });
	    } 
	    else if (user) 
	    {
	    	console.log('PUT_bbt~email.js - user is valid');

	    	if((typeof req.body.recordings === 'undefined') && (typeof req.body.date === 'undefined')) {
	    		
	    		console.log('PUT_bbt~email.js - Lets clean out the bbtRecordings array');

	    		user.bbtRecordings = []; //empty array

	    		return user.save(function(err){

			    		if(err) {
			    			res.send(err);
			    		}
			    		else {
			    			res.json({message:'emptied bbtRecordings array'});
			    		}
			    	});
	    	}

	    	//display all dates
	    	var allRecordings = user.bbtRecordings;
	    	
	    	if(allRecordings.length > 0) {

		    	console.log('PUT_bbt~email.js - allRecordings has content: ' + allRecordings);

		    	var numOfRecordings = allRecordings.length;
		    	console.log('PUT_bbt~email.js - user ' + user.email 
		    		+ ' found! We are looking for req.body.date: ' + req.body.date);

		    	console.log('PUT_bbt~email.js - Currently, there are ' 
		    		+ numOfRecordings + ' DATE(S) with bbt recordings in the server mongo db');
		    	
		    	if (numOfRecordings > 0) { //then we update the database

			    	var newBBTDay = {
			    		date: req.body.date,
			    		recordings: req.body.recordings
			    	};

			    	
		    		var lastElement = allRecordings[allRecordings.length-1]

		    		//find if there exist a date already
		    		if(req.body.date===lastElement.date) {
		    			console.log('PUT_bbt~email.js - bbt recordings with same DATE exists in db.');
		    			console.log('PUT_bbt~email.js - we need to replace it with our incoming one');
		    			console.log('there are ' + lastElement.recordings.length 
		    				+ ' number of recordings for date: ' + lastElement.date);
		    			var popped = allRecordings.pop();
		    			console.log('popped: ' + popped.date);
		    		}
		    			
		    		console.log('PUT_bbt~email.js - insert the new bbt day:');
		    		console.log('PUT_bbt~email.js - date: ' + newBBTDay.date 
		    			+ ', with ' + newBBTDay.recordings.length + ' number of recordings' );

		    		//we insert the element
		    		user.bbtRecordings.push(newBBTDay);
		   			console.log('PUT_bbt~email.js - save the newBBTDay into our database');

		    		user.save(function(err){

			    		if(err) {
			    			res.send(err);
			    		}
			    		else {
			    			res.json({message:'updated BBT' + newBBTDay.date});
			    		}
			    	});
		    	}//if num of recordings > 0
		    } //if allRecordings !== undefined
		    else
		    {
		    	console.log('PUT_bbt~email.js - no BBT dates in cloud mongo db');
		    	console.log('PUT_bbt~email.js - Lets create new bbt with date: ' + req.body.date 
		    		+ ', with ' + req.body.recordings.length + ' number of recordings.');
	    		var newBBTDay = {
		    		date: req.body.date,
		    		recordings: req.body.recordings
		    	};

				console.log('PUT_bbt~email.js - now lets push it into user.bbtRecordings');
			    user.bbtRecordings.push(newBBTDay);
			    console.log('PUT_bbt~email.js - save the newBBTDay into our database');

	    		user.save(function(err){

		    		if(err) {
		    			res.send(err);
		    		}
		    		else {
		    			res.json({message:'updated BBT' + newBBTDay.date});
		    		}
		    	});

		    }

	    } //if else
 
	}); //findOne

});
}