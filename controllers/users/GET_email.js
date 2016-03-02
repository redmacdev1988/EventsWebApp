var User   = require('../../models/user'); // get our mongoose model

module.exports = function(router){

	//return one user info
	//http://localhost:8080/users/rtsao@uci.edu

	//Headers(2):
	//x-access-token "ashdfiajshdfi"
	//x-access-email "rtsao@uci.edu"
	router.get('/:user_email', function(req, res) {

		console.log('GET_email.js - req.params.user_email: ' + req.params.user_email);
	  	
	  	User.findOne({
	    	email: req.params.user_email
		}, function(err, user) {

			try {
				if(err)throw err;
				console.log('GET_email.js - user found: ' + user.email);
				res.json(user);
			}
			catch(err) {
				console.log('GET_email.js - Error in finding user ' + req.params.user_email);
				console.log('err: ' + err);
				res.json({
					success:false,
					error: 'Error: ' + err
				});
			}


		});

	}); 



}