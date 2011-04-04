var Twiml = require('../../node-twilio/lib').Twiml;
var util = require('util');

module.exports = function(app,opts) {

	app.get('/', function(req, res){

	//res.cookie('userDigits', 'how are you?', { maxAge: 900000 });

		if(!req.session){
			req.session.regenerate();
		}
		
		if( (req.cookies.userdigits == '511') || (req.cookies.userdigits == '1') ) {
			
            res.render('root.loggedin.jade');
           
            var phone = opts.locals.serveropts.phn;
            var sockH = opts.locals.serveropts.sH;
     
            sockH.once('gotClient', function(seh){
                
                sockH.on('recordRequested', function() {
                   
                   // would check to see if a call is not in progress yet. but it might choke or error 
                   // so just lock the button until the request completes or after a timeout with jquery :D
                        
                    phone.setup( function() {

                    // Hey, let's call the person
                    phone.makeCall( req.cookies.phonenumber, null, function(call) {
                       
                        // tell client they are being called to record a message
                        seh._trigger('recorderCalling', 'Now calling you so you can leave a message');
                                                                        
                        call.once('answered', function(reqParams, res){
                           
                           var say = new Twiml.Say('Hello! Please leave a message after the beep.'); 
                           var recorder = new Twiml.Record({transcribe: true, playBeep: true, timeout: 10});
                           
                            res.append(say).append(recorder);
                            res.send();
                            
                            recorder.on('recorded', function(reqParams, res ){
                               
                               console.log('Recording is at: ' + reqParams.RecordingUrl);
                                
                            });

                            recorder.on('transcribed', function(reqParams, res ){
                              
                              // once the message is received display it

                              seh._trigger('messageTranscribed', reqParams.TranscriptionText );
                                
                            });

                        });

                    });

                    });
                                                                                                                                                               
                });

            });
                 
		} else if (req.cookies.userdigits == '2' ){
			// some how display a message that says "please allow us to transcribe your messages for the application to work"
		} else {
			res.render('home.jade', opts);
		}

	});
}
