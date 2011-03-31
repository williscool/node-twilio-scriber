module.exports = function(app,opts) {

	app.get('/', function(req, res){

	//res.cookie('userDigits', 'how are you?', { maxAge: 900000 });

		if(!req.session){
			req.session.regenerate();
		}
		
		if( (req.cookies.userdigits == '511') || (req.cookies.userdigits == '1') ) {
			
            res.render('root.loggedin.jade');
           
            var sockH = opts.locals.serveropts.sH;
             
            sockH.once('gotClient', function(seh){
                
                sockH.on('recordRequested', function() {
                   
                   // would check to see if a call is not in progress yet. but it might choke or error so I'll just lock the button
                   // until the request completes or after a timeout with jquery :D 
                    
                        // tell client they are being called to record a message
                        seh._trigger('recorderCalling', 'Now calling you so you can leave a message');

                        // acutally call them

                        // once the message is received display it

                      setTimeout( seh._trigger('messageTranscribed', 'the message i would have ' ) , 6000) ;
                });

            });
                 
		} else if (req.cookies.userdigits == '2' ){
			// some how display a message that says "please allow us to transcribe your messages for the application to work"
		} else {
			res.render('home.jade', opts);
		}

	});
}
