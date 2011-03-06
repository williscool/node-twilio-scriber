var express = require('express');
var app = express.createServer();
var valid = require('validator');
var jade = require('jade');
var logger = require('../node-logger').createLogger('development.log'); // logs to a file

<<<<<<< HEAD
=======

>>>>>>> da7ddcd... Added in status messages so I can tell whats going on when
var TwilioClient = require('../node-twilio/lib').Client,
      Twiml = require('../node-twilio/lib').Twiml,
      util = require('util');

 var client = new TwilioClient(creds.sid, creds.authToken, creds.hostname);

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


<<<<<<< HEAD
=======
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

	    res.send(html);
	}); 

	console.log('call initiated');

	// Phone.setup() configures the phone number object. It requests the phone number instance
	// resource associated with the number and populates an internal data structure representing itself.
	// The callback passed in is called when setup completes.
	phone.setup(function() {
	    // Hey, let's call my parents!
		phone.makeCall('+18674451795', null, function(call) {
			// The callback for makeCall is passed a "call" object.
			// This object is an event emitter.
			console.log('making the calls');	
			call.on('answered', function(reqParams, res) {
			console.log('call was answered');				
			// Here, reqParams is a map of the POST vars Twilio sent when it requested our auto-urii

			logger.debug('call on answered response \n');
			logger.debug(res);
			
			logger.debug('call on answered reqParams \n');
			logger.debug(reqParams);
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
