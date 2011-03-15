module.exports = function(app,opts) {

var socket = opts.socket;

	app.get("/test", function (req, res){
        
		res.cookie( 'userDigits' , '2');
        	res.render('makingCall.jade', opts);
	});

        socket.on('connection', function(client){
          //...

          // Success!  Now listen to messages to be received
          client.on('message', function(message){
          //just print out 'message' to get the sockie ide
                if(message.sid) {
                       client.send('Client Session Id', message.sid );
                }

                client.send('hello client');

          });

          client.on('disconnect',function(){
                siologger.debug('Server has disconnected');
          });

        });


}
