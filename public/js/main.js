$(document).ready( function () {

	var messageContainer = $("div#message");

	if (messageContainer.length) {
		
	   messageContainer.delay(790).effect("pulsate", { times:6 }, 1500);

	}
});


var sid = $.cookie('connect.sid');


// Create SocketIO instance, connect
var socket = new io.Socket();

socket.connect(); 

// Add a connect listener
socket.on('connect',function() {
  console.log('Client has connected to the server!');
	socket.send({sid:sid});
});
// Add a connect listener
socket.on('message',function(data) {
  console.log('Received a message from the server!',data);
});
// Add a disconnect listener
socket.on('disconnect',function() {
  console.log('The client has disconnected!');
});

