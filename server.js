var express = require('express');
var app = express.createServer();
var valid = require('validator');


var TwilioClient = require('../node-twilio/lib').Client,
      Twiml = require('../node-twilio/lib').Twiml,
      sys = require('sys');


app.get('/', function(req, res){


var client = new TwilioClient(creds.sid, creds.authToken, creds.hostname);

    res.send('<h1> Hi there. Im calling you! </h1>');

	// Let's get a PhoneNumber object
	// Note: It is assumed that +16067777777 is a Twilio phone number available from your account
	// Another note: You may pass in either a phone number or a phone number sid.
	var phone = client.getPhoneNumber('+14505554288');

	// Phone.setup() configures the phone number object. It requests the phone number instance
	// resource associated with the number and populates an internal data structure representing itself.
	// The callback passed in is called when setup completes.
	phone.setup(function() {
	    // Hey, let's call my parents!
		phone.makeCall('+14045557777', null, function(call) {
			// The callback for makeCall is passed a "call" object.
			// This object is an event emitter.
			
			call.on('answered', function(reqParams, resp) {
			    // Here, reqParams is a map of the POST vars Twilio sent when it requested our auto-uri
			    // res is a Twiml.Response object.
			    // We can "append" Twiml elements to res. Let's append a Say verb element.
			    resp.append(new Twiml.Say('Hey William! I hope you are having fun! it works'));
			    resp.send();
		     	});
		});
	
	});

});

app.listen(3000);

console.log('Express server started on port %s', app.address().port);
