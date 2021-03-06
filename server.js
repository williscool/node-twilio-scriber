var creds = require('./config').Credentials;

var connect = require('connect');
var express = require('express');
var app = express.createServer();
var check = require('validator').check,
    sanitize = require('validator').sanitize;

var sockH = require('./lib/sockethandler').config(app);

app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({ secret: "simple", cookie: { httpOnly: false } }));
app.use(express.bodyParser());

var callnumber = require('./config').CallTestNumber.number;


var TwilioClient = require('./node-twilio/lib').Client,
      Twiml = require('./node-twilio/lib').Twiml,
      util = require('util');

var tclient = new TwilioClient(creds.sid, creds.authToken, creds.hostname);

// Let's get an OutgoingPhoneNumber object
// Note: It is assumed that +16067777777 is a Twilio phone number available from your account
// Another note: You may pass in either a phone number or a phone number sid.
var phone = tclient.getOutgoingPhoneNumber(creds.outgoing);

app.listen(3000);

// site root
var jadeopts = {
    locals: {
        user: {
            name: 'Will',
            phone: callnumber,
            email: 'youname@malinator.com',
        },

        serveropts: {
            formActionUrl: '/call',
            phn: phone,
            sH: sockH,
        }
    }
};
require('./controllers/root')(app, jadeopts);


// call router
app.post('/call', function(req,res){
    // need to check for a phone number and redirect if there is none with a warning!

    res.render('makingCall.jade', {});

    sockH.once('gotClient', function(seh){

       userinfo = req.body.user;
      // kill any cross site scripting attacks 
       userinfo.email = sanitize(userinfo.email).xss();
       userinfo.phone = sanitize(userinfo.phone).xss();
       userinfo.name = sanitize(userinfo.name).xss();
    
        seh._trigger('gotUserDetails', userinfo);
            
        console.log('call initiated');

        // Phone.setup() configures the phone number object. It requests the phone number instance
        // resource associated with the number and populates an internal data structure representing itself.
        // The callback passed in is called when setup completes.
        phone.setup(function() {
            // Hey, let's call the person 
            phone.makeCall(req.body.user.phone, null, function(call) {
                // The callback for makeCall is passed a "call" object.
                // This object is an event emitter.
                
                 console.log('making the calls');

                    seh.calling('Now Calling you');

                //call to animation - v2    
                call.once('answered', function(reqParams, res) {

                    console.log('call was answered');
                    // Here, reqParams is a map of the POST vars Twilio sent when it requested our auto-uri

                        // res is a Twiml.Response object.
                        // We can "append" Twiml elements to res. Here we are making a gather element
                    var lines = {
                            l1: 'Hello! Please Indicate if you would like to have your calls with us transcibed.',

                            l2: ' Press 1 if yes. 2 if no . followed by the pound sign.'
                    };

                    var say =  new Twiml.Say(lines.l1 + lines.l2);

                    var gatherTwiML = new Twiml.Gather(say);
                    var ifGatherFails = new Twiml.Say('We are sorry but we did not recieve any input. Goodbye');

                    res.append(gatherTwiML).append(ifGatherFails);

                    res.send();
                                    
                    gatherTwiML.on('gathered', function(reqParams, res) {
                        
                        console.log(reqParams);   
                        // Here, reqParams is the posted data from Twilio's request
                        // and Response is a Twiml.Response object.
                        // With 'Gathers', Twilio's request includes a Digits param
                        // that contains the digits the user entered.

                        var num = reqParams.Digits;
                        console.log('User pressed: #' + num);

                        // send to client

                        seh.gotDigits(num);

                        var thank = new Twiml.Say('Thank you! Your answer has been stored. Please return to the home page.');
                        res.append(thank).append(new Twiml.Hangup());
                        res.send();

                    });               
                

                });

                call.once('ended', function(reqParams) {
                    console.log('Call ended');
                    res.redirect('/');
                }); 

        
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

};

//require('./controllers/test')(app, pageopts);

//REMEMBER TO CHANGE THIS TO A GET IF YOU WANT TO USE A BROWSER TO SEE IT.
app.post("/shtest", function (req, res){

    res.render('makingCall.jade', pageopts);
    
    if(req.body.user != 'undefined'){

       userinfo = req.body.user;
       
       userinfo.email = sanitize(userinfo.email).xss();
       userinfo.phone = sanitize(userinfo.phone).xss();
       userinfo.name = sanitize(userinfo.name).xss();

       console.log(userinfo);

     sockH.once('gotClient', function(seh){
           
        seh._trigger('gotUserDetails', userinfo);
        seh.greeting('hi there client. this is a bit easier to write');
        seh.calling('im caliing you!');
        seh.gotDigits(511);

     });
        
    } else{

     sockH.once('gotClient', function(seh){

        seh.greeting('hi there client. this is a bit easier to write');
        seh.calling('im caliing you!');
        seh.gotDigits(511);

     });

    }
});

app.get('/cookietest', function(req, res) {

     console.log(req.cookies);
     res.redirect('/');
   
});

// logout page
require('./controllers/logout')(app, jadeopts);


app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


console.log('Express server started on port %s', app.address().port);
