var User   = require('../../models/user'); // get our mongoose model

module.exports = function(router){

	//Headers(2)
	//x-access-token "asdfjhasidufhaiusdf"
	//x-access-email "rtsao@uci.edu"

	//Body(2)
	//modelValue "Ganten"
	//modelKey   "name"
	router.put('/:user_email', function(req, res) {

		console.log('email: ' + req.params.user_email 
			+ ', update modelKey (' + req.body.modelKey + ') to value: ' + req.body.modelValue);

		//change the model's value by its key
		User.findOne({
	    	email: req.params.user_email
	  
	  	}, function(err, user) {

		    if (err) throw err;

		    if (!user) 
		    {
		    	res.json({ success: false, message: 'User not found.' });
		    } 
		    else if (user) 
		    {
		    	//found valid user, let's change the value

		    	console.log('user[' + req.body.modelKey + ']: ' + user[req.body.modelKey]);
		    	user[req.body.modelKey] = req.body.modelValue;

		    	user.save(function(err){
		    		if(err) 
		    			res.send(err);
		    		else
		    			res.json({message:'updated key' + req.body.modelKey 
		    				+ ' with value ' + req.body.modelValue});
		    	});
		    } // if/else
		}); // findOne
	}); //put

}