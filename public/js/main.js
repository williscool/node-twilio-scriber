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
		
		if(window.console) console.log('The '+ obj.event +' was fired.');
		});

		// Add a disconnect listener
		socket.on('disconnect',function() {
			  console.log('The server has disconnected!');
		});

		handler._trigger = function(event, data) {
			socket.send({"event" : event, "data" : data});
		}

		handler.GetTime = function() {
			handler._trigger('getTime', '');
		}
		
		handler.sendEvent = function(ev,msg) {
			handler._trigger(ev,msg);
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
	
	// what happens when you submit the form on the logged in page	
	$("form#rootloggedin").submit(function() {
   
        // sending the record event. The chocolate text is random and not used. 
        // Just saying that because I always hate when people do that and don't tell you lol
         
        jqSH.sendEvent('recordRequested','chocolate');
        	
		$("form span").text("You clicked the button!").show().fadeOut(1000);

		var respCont = $("div.callresponse:last");
		
		// make a new element based off of the other old and ad it at the bottom	
		$(respCont).before(respCont.clone());
		
		// display the new element
		respCont.show("slow");

        // blank out the message text box. the call warning text box will be replaced immediately 
        respCont.find('p').text('');
		
        $(jqSH).bind('recorderCalling', function(event, message){
            
            // header for most recent call warning header 
            respCont.find('h3').text(message).fadeIn(1000);
            
            //lock the submit button so we don't get more than one request at a time
            $("form#rootloggedin input").attr('disabled', 'disabled');

        });

        $(jqSH).bind('messageTranscribed', function(event, message){
            
            //display the message text! 
		    respCont.find('p').text(message);

            // request finished so we're unlocking the submit button
            $("form#rootloggedin input").removeAttr('disabled');

        });

		return false;
	});

});
