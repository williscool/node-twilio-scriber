(function( $ ){

	$.socketHandler = function(userSID) {
		
	// Create SocketIO instance, connect
	var socket = new io.Socket();
	handler = {};

		socket.connect();

		// Add a connect listener
		socket.on('connect',function() {
			  console.log('Client has connected to the server!');
				socket.send({sid:userSID});
		});

		socket.on('message', function(obj){

			if('event' in obj) {
			    $(handler).trigger(obj.event, obj.data);
			}
		});


		// Add a disconnect listener
		socket.on('disconnect',function() {
			  console.log('The client has disconnected!');
		});

		handler._trigger = function(event, data) {
			socket.send({"event" : event, "data" : data});
		}

		handler.GetTime = function() {
			handler._trigger('getTime', '');
		}

	return handler;

	}

})( jQuery );


$(document).ready( function () {

	var sid = $.cookies.get('connect.sid');

	var jqSH = $.socketHandler(sid);

	//once the user answers with their digit
	$(jqSH).bind('gotDigits', function(event, digits){

		$.cookies.set('userDigits', digits);

	});

	
	//the twilio is calling the client
	$(jqSH).bind('calling', function(event, message){

		var messageContainer = $("div#message");

		if (messageContainer.length) {
			
		messageContainer.effect("pulsate", { times:6 }, 1500);
		messageContainer.text(message);
		
		}

	});
	
	// greet the user on their console
	$(jqSH).bind('greeting', function(event, message){
		if(window.console) console.log(message);
	
	});

});
