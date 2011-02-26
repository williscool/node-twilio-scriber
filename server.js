var express = require('express');
var app = express.createServer();
var valid = require('validator');
var TwilioClient = require('twilio').Client,

      Twiml = require('twilio').Twiml,
      sys = require('sys');

var client = new TwilioClient(MY_ACCOUNT_SID, MY_AUTH_TOKEN, MY_HOSTNAME);

// Let's get a PhoneNumber object
// Note: It is assumed that +16067777777 is a Twilio phone number available from your account
// Another note: You may pass in either a phone number or a phone number sid.
var phone = client.getPhoneNumber('+16067777777');

// Phone.setup() configures the phone number object. It requests the phone number instance
// resource associated with the number and populates an internal data structure representing itself.
// The callback passed in is called when setup completes.
phone.setup(function() {
    // Hey, let's call my parents!
    phone.makeCall('+19058926737', null, function(call) {
        // The callback for makeCall is passed a "call" object.
        // This object is an event emitter.
        call.on('answered', function(reqParams, res) {
            // Here, reqParams is a map of the POST vars Twilio sent when it requested our auto-uri
            // res is a Twiml.Response object.
            // We can "append" Twiml elements to res. Let's append a Say verb element.
            res.append(new Twiml.Say('Hey mom and dad! I hope you are having fun! I love you!'));
            res.send();
     });
});



app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(3000);

console.log('Express server started on port %s', app.address().port);
