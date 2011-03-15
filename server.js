var logger = require('../node-logger').createLogger('transciber.log'); // logs to a file
var siologger = require('../node-logger').createLogger('sio.log'); // logs to a file
var creds = require('./config').Credentials;

var connect = require('connect');
var express = require('express');
var io = require('socket.io'); 
var app = express.createServer();
var valid = require('validator');


app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({ secret: "simple", cookie: { httpOnly: false } }));


var callnumber = require('./config').CallTestNumber.number;


var TwilioClient = require('../node-twilio/lib').Client,
      Twiml = require('../node-twilio/lib').Twiml,
      util = require('util');

var client = new TwilioClient(creds.sid, creds.authToken, creds.hostname);

// Let's get an OutgoingPhoneNumber object
// Note: It is assumed that +16067777777 is a Twilio phone number available from your account
// Another note: You may pass in either a phone number or a phone number sid.
var phone = client.getOutgoingPhoneNumber(creds.outgoing);


app.listen(3000);

var socket = io.listen(app); 

app.get('/call', function(req,res){

	res.render('makingCall.jade', {});

	console.log('call initiated');

	// Phone.setup() configures the phone number object. It requests the phone number instance
	// resource associated with the number and populates an internal data structure representing itself.
	// The callback passed in is called when setup completes.
	phone.setup(function() {
	    // Hey, let's call the person 
		phone.makeCall(callnumber, null, function(call) {
			// The callback for makeCall is passed a "call" object.
			// This object is an event emitter.
			
			console.log('making the calls');
			
			//call to animation - v2	
                        call.on('answered', function(reqParams, res) {

                                console.log('call was answered');
                                // Here, reqParams is a map of the POST vars Twilio sent when it requested our auto-urii

                                    // res is a Twiml.Response object.
                                    // We can "append" Twiml elements to res. Here we are making a gather elementi
                                var lines = {
                                        l1: 'Hello! Please Indicate if you would like to have your calls with us transcibed.',

                                        l2: ' Press 1 if yes. 2 if no . followed by the pound sign.'
                                };

                                var say =  new Twiml.Say(lines.l1 + lines.l2);

                                var gatherTwiML = new Twiml.Gather(say);
                                var ifGatherFails = new Twiml.Say('We are sorry but we did not recieve any input. Goodbye');

                                res.append(gatherTwiML).append(ifGatherFails);
								

                                logger.debug('call on answered Twiml response \n');
                                logger.debug(res);
                                
				res.send();
								
			      gatherTwiML.on('gathered', function(reqParams, res) {
				  // Here, reqParams is the posted data from Twilio's request
				  // and Response is a Twiml.Response object.
				  // With 'Gathers', Twilio's request includes a Digits param
				  // that contains the digits the user entered.
			
				var num = reqParams.Digits;
				  console.log('User pressed: #' + num);

                                        req.session.userDigits = num;
                                        req.cookies.userDigits = num;
                                        var thank = new Twiml.Say('Thank you! Your answer has been stored. Please return to the home page.');
                                        res.append(thank).append(new Twiml.Hangup());
                                        res.send();

			      });				
			

                        });

		       call.on('ended', function(reqParams) {
				console.log('Call ended');
			res.redirect('/');
			});	

	
		});

	});
});


// test page
var pageopts = {

                locals:{

                        serverinfo: {
                                url:creds.hostname,

                        },

                },
	
		socket:socket
};

require('./controllers/test')(app, pageopts);



// site root
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
require('./controllers/root')(app, jadeopts);

// logout page
require('./controllers/logout')(app, jadeopts);




app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


console.log('Express server started on port %s', app.address().port);
