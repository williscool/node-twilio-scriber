module.exports = function(app,opts) {

var socket = opts.socket;

	app.get("/test", function (req, res){
        
		//res.cookie( 'userDigits' , '2');
        	res.render('makingCall.jade', opts);
	});

        socket.on('connection', function(client){
          
	client.send({ "event": 'greeting', "data":'hello client'});

          // Success!  Now listen to messages to be received

	// always use this syntax when sending messages
	// client.send({ "event" : event, "data" : data});

          client.on('message', function(message){
          //just print out 'message' to get the sockie ide
		//console.log(message);

                if(message.sid) {
				
			console.log(message.sid);

			client.send({"event":'calling', "data":"Now Calling..."});
                     
			client.send({"event":'gotDigits', "data": 511 })
                }

          });

          client.on('disconnect',function(){
          });

        });


}
