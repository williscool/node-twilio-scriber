var express = require('express');
var app = express.createServer();
var valid = require('validator');
var jade = require('jade');
var logger = require('../node-logger').createLogger('development.log'); // logs to a file
var creds = require('./config').Credentials;

var callnumber = require('./config').CallTestNumber.number;


var TwilioClient = require('../node-twilio/lib').Client,
      Twiml = require('../node-twilio/lib').Twiml,
      util = require('util');

var client = new TwilioClient(creds.sid, creds.authToken, creds.hostname);

// Let's get an OutgoingPhoneNumber object
// Note: It is assumed that +16067777777 is a Twilio phone number available from your account
// Another note: You may pass in either a phone number or a phone number sid.
var phone = client.getOutgoingPhoneNumber(creds.outgoing);

app.get('/', function(req, res){

	var jadeopts = {
	    locals: {
		user: {
		    name: 'Will',
		    email: 'youname@malinator.com',
		},

		serveropts: {
		    formActionUrl: '/call',
		}
	    }
	};

	jade.renderFile(__dirname + '/form.jade', jadeopts, function(err, html){
	    if (err) throw err;
	//    console.log(html);

	    //res.send('<h1> Hi there. Im calling you! </h1>' + html );
	    res.send(html);
	});

});

app.get('/call', function(req,res){

	var options = {};
	jade.renderFile(__dirname + '/makingCall.jade', options, function(err, html){
	    if (err) throw err;

	    res.send(html);
	}); 

	console.log('call initiated');

	// Phone.setup() configures the phone number object. It requests the phone number instance
	// resource associated with the number and populates an internal data structure representing itself.
	// The callback passed in is called when setup completes.
	phone.setup(function() {
	    // Hey, let's call my parents!
		phone.makeCall(callnumber, null, function(call) {
			// The callback for makeCall is passed a "call" object.
			// This object is an event emitter.
			
			console.log('making the calls');	

			call.on('answered', function(reqParams, res) {
			console.log('call was answered');				
			// Here, reqParams is a map of the POST vars Twilio sent when it requested our auto-urii

			logger.debug('call on answered response \n');
			logger.debug(res);
			
			    // res is a Twiml.Response object.
			    // We can "append" Twiml elements to res. Let's append a Say verb element.
			    res.append(new Twiml.Say('Hey William! it works'));
			    res.send();
			

		     	});
		});
	
	});

});


app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
app.listen(3000);

console.log('Express server started on port %s', app.address().port);
