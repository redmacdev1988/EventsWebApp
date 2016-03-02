var User   = require('../../models/user'); // get our mongoose model

module.exports = function(router){


//BODY(2)

//recordings   array
router.put('/sign/:user_email', function(req, res) {


	console.log('---------------REACHED PUT /SIGN/email----------------');

	console.log('PUT_bbt~email.js - email: ' + req.params.user_email) ;

	if( typeof req.body.signName !== 'undefined') {
		console.log(' PUT_sign~emails - req.body.signName: ' 				+ req.body.signName + ', ' 
					+ 'req.body.date: ' 			+ req.body.date + ', ' 
					+ 'req.body.original_prob: ' 	+ req.body.original_prob + ', '
					+ 'req.body.calculated_prob: ' 	+ req.body.calculated_prob);
	}

	User.findOne( { email:req.params.user_email }, function(err,user){

		if (err) throw err;

	    if (!user) 
	    {
	    	res.json({ success: false, message: 'User not found.' });
	    } 
	    else if (user) 
	    {
	    	//check to see if date is nil or not
	    	console.log('PUT_sign~emails - user exists.....');

	    	if(typeof req.body.signName === 'undefined') {

	    		console.log('PUT_sign~emails - need to blank sign array');

	    		user.allSigns = [];
	    		return user.save(function(err){

		    		if(err) {
		    			res.send(err);
		    		}
		    		else {
		    			res.json({message:'emptied out allSigns array'});
		    		}
		    	});
	    	}

	    	var index;
	    	var signToAdd;

    		for ( var i = 0; i < user.allSigns.length; i++) {

    			var aSign = user.allSigns[i];

    			console.log('aSign.signName: ' + aSign.signName);

    			if(aSign.signName === "tenderness") {
    				index = user.allSigns.indexOf(aSign);
    				console.log('found ' + aSign.signName + ' at index ' + index);
    				break;
    			}
	    	}

	    
	    	if (index === undefined && req.body.date !== undefined) {
	    		console.log('index of tenderness sign NOT FOUND, and incoming is valid sign'
	    			+ '...thus we just push onto user.allSigns array');

	    		signToAdd = {
	    			"signName" 			: req.body.signName,
	    			"date"				: req.body.date,
    				"original_prob"		: req.body.original_prob,
    				"calculated_prob"	: req.body.calculated_prob
	    		};

	    		user.allSigns.push(signToAdd);

	    	} 
	    	else if (req.body.date === undefined && index >= 0) {
	    		console.log('Incoming sign DNE, but sign name matches, we must remove previous sign');
	    		user.allSigns.splice(index, 1);
	    	}
	    	else if (index !== undefined && req.body.date !== undefined) {
	    		
	    		console.log('index of tenderness FOUND, incoming sign VALID...' 
	    					+ 'thus we need to edit current tenderness');

	    		user.allSigns[index].date = req.body.date;
	    		user.allSigns[index].original_prob = req.body.original_prob;
	    		user.allSigns[index].calculated_prob = req.body.calculated_prob;
	    	}
	    	else 
	    	{

	    	}

	    	user.save(function(err){

	    		if(err) {
	    			res.send(err);
	    		}
	    		else {
	    			res.json({message:'updated Sign: ' + req.body.signName});
	    		}
	    	});

	    } //if else

	});

	/*
	return res.status(200).send({ 
        success: true, 
        message: 'put function reached.' 
    });
    */

	});

} //router
