var User   = require('../../models/user'); // get our mongoose model

module.exports = function(router){

    // route to return all users 
	// http://localhost:8080/users/all

	//Headers(2):
	//x-access-token ""
	//x-access-email ""
	router.get('/all', function(req, res) {

	  	User.find({}, function(err, users) {
	  		try {
	  			console.log('user(s) found');
	  			if(err) throw err;
		    	res.json({"users" : users});
			}
			catch(err) {
				console.log('error in displaying all users: ' + err);
				
				res.json({
					success:false,
					error: 'error in displaying all users: ' + err
				});
			}

		});

	});   

    //other routes..
}