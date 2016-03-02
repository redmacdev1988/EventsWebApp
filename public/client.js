console.log(' --- client.js start --- ');

window.gPort = "6680";
window.gURL = "http://localhost:" + window.gPort;

/////////// init device id ///////////////////////////////

$(function() {

	console.log("client.js - --------> running init for app");

	$("#note").html("<p></p>").css({'height':0, 'opacity':0});

	//checks the database for datetime info.
	$.ajax({
		type: 	'POST',
		url: 	window.gURL + "/init",
		data:{},
		success: function(fromServer) {

			if(fromServer.message === "REGISTRATION_CLOSED") {
				console.log("REGISTRATION IS NOW CLOSED...LETS empty registration and directions");
				//let's empty registration

				$('#registrations-container').children().fadeOut(800, function() {
				    $('#registrations-container').empty();
				});

				$('.container').children().fadeOut(800, function() {
				    $('.container').empty();
				});

				$('#RegistrationClosedModal').modal('show');
			}

			else if (fromServer.message === "NO_EVENTS") {

				$("#event-date").text("");
				$("#event-description").text("No event scheduled");
			}
			else {
				console.log("client.js - next event is: " + fromServer.data);

				console.log("date: " +fromServer.data.date);
				console.log("description: " + fromServer.data.description);

				var cleanDate = fromServer.data.date.substr(0, fromServer.data.date.indexOf('T')); 

				$("#event-date").text(cleanDate);
				$("#event-description").text(fromServer.data.description);
			}
		}
	}); //ajax
	
	console.log('client.js - entered main function!');


	//for when we click inside of a textfield
	$('.form-control').click(function() {
		$("#attendee-email").css({"background-color":"white"});
	});

	//only allow alphabets and spaces for emails
	$("#attendee-email").keydown(function(event){

		//allows ., backspace, and underline
		if ( 	(event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 189)  
			|| 	(event.keyCode >= 65 && event.keyCode <= 90) //A-Z
			|| 	(event.keyCode >= 97 && event.keyCode <= 122  )  //a-z
			)
		{
    		// let the numerics appear
    	}
    	else {
    		event.preventDefault();		
    	}
	});

	//$('#register-user').on('shown.bs.modal', function () {
	$('#register-attendee').click(function() {
 
 		console.log("client.js - .on arrived");
 		var everythingOK = false;

		$("#note").clearQueue();
		$("#note").stop();

		console.log("client.js - register attendee button pressed!");

		var attendeeEmail 		= $('#attendee-email').val();

		if(!attendeeEmail) {

			console.log("client.j - empty textfield detected");
			$("#attendee-email").css({"background-color":"#fff0f7"});

			$("#note")
			.html("<p>Please fill out all empty textfields</p>")
			.animate({ height: 90, opacity: 1}, 'slow');

			$('#note').delay(2000).animate({ height: 0, opacity: 0 }, 'slow');
			console.log("client.js - exiting....textfields empty");
			return;
		}

		console.log("textfield data OK!.... " + attendeeEmail);
		console.log("executing AJAX POST /registerAttendee");

		$('#register-user').modal({backdrop: 'static', keyboard: false});
		$('#register-user').modal('show');

		$.ajax({
	        type: 	'POST',
	        url: 	window.gURL + "/registerAttendee",

			data:
				{
				    "email"				: attendeeEmail
				},
			success: function(msg) {

				console.dir(msg);
				
				if(msg.message === "EMAIL_EXISTS" || msg.message === "EMPLOYEE_ID_EXISTS") {

					setTimeout( function() {

						$('#register-user').modal('hide');
						console.log("client.js - EMAIL or EMPLOYEE ID ALREADY EXISTS");

						$("#note")
						.html("<p>Email or Employee ID already exists. Please retry")
						.animate({ height: 90, opacity: 1}, 'slow');

						$('#note').delay(5000).animate({ height: 0, opacity: 0}, 'slow');

					}, 3000);	
				} 
				
				else 
				{
					$('#register-user').modal('hide');
					console.log('client.js -  register-attendee returned: ' + msg.message);
					$("#note")
					.html("<p>Thank for your interest! Please check your email to Register for this event</p>")
					.animate({ height: 90, opacity: 1}, 'slow');
					$('#note').delay(5000).animate({ height: 0, opacity: 0}, 'slow');
				} 
				

	    	} //success
	    }); //ajax
	});


	$('#send-results').click(function() {

		console.log("send results button pressed!");
		
	    $.ajax({
	        type: 	'GET',
	        url: 	window.gURL + "/email_to_admin",

			success: function(msg) {
				console.log('client.js -  register-attendee returned: ' + msg.message);
	    	}
	    }); //ajax
		
	}); //click function



}); //function

console.log(' --- client.js end --- ');
