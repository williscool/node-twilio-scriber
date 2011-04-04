# Node-twilio-scriber

## Welcome to the node twilio (tran)scriber.

Its a little web app that allows one to record voice messages and have them transcibed using a twilio account

it uses node.js of course and

- express
- node - twilio (with added demo support)
- socket.io
- jquery

among other things


All communication with the browser is in realtime as the actions happen back and forth with the twilio server


( Got really tired of all node.js and/or socket.io demo's being of chat room apps ;) )


## Usage

1) setup

make a file called `config.js` based on the included `config.sample.js` with your twilio credentials (call test number is the number you want it to call when you test it.)

2) run 

    node server.js

3) go to the root url whatever server:port configure you are setup on in your web browser i.e.

    example.com:3000

4) click the submission button on the form. Try it out :)


## Todo

- validate phone number entries everything else can be whatever as long as its not xss (which is already sanitized)

- make stuff persistent for session until you logout.

- replace status headers with the message timestamp when the recording is receieved.


## Known Issues

- The login may randomly take more than one shot to work. (Click submit have it it call you. It may choke. Don't restart the server, just go back to the home page and submit again it will work. Don't quite know why though)
also sometimes if you retry an action that calls the twilio api too many times the twilio server gets confused about where to callback on your server or may call when there is already a call in progress and end up going straight to your voicemail.
if that happens leave it for about 10 minutes while all of that gets sorted out and everything will be fine again.

- authentication is broken / non-existant so messages may be sent to the wrong client. Socket.io messages that is so transcribed recordings as well login ones. This only an issue if more than one person logs in.


## ALSO DO NOT USE THIS SERVER IN PRODUCTION AS IS.

- it only uses express's built in memory store so all user data is destoryed when the server is restarted

- It doesn't use httponly for its session cookies so session hijacking (and thus message stealing) is possible

- again auth is broken so logins could get mixed up and different people could get each others messages if multple people login.
