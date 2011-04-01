# Node-twilio-scriber

## Welcome to the node twilio (tran)scriber.

Its a little web app that allows one to record voice messages using a twilio account

it uses node.js of course and

- express.js
- node - twilio (with added demo support)
- socket.io
- jquery

among other things


( Got really tired of all node.js and/or socket.io demo's being of chat room apps ;) )


## Usage

1) setup

make a file called `config.js` based on the included `config.sample.js` with your twilio credentials

2) run 

    node server.js

3) go to the root url whatever server:port configure you are setup on in your web browser i.e.

    example.com:3000

4) click the submission button on the form. Try it out :)


## Known Issues

### Right now it is VERY much a work in progress. 

- The login may randomly take more than one shot to work. (Click submit have it it call you. It may choke. Don't restart the server, just go back to the home page and submit again it will work. Don't quite know why though)

- the recording page view works correctly but twilio communcation is a bit off. I think it because of mutating the global response object. working on this now.

- authentication is broken / non-existant so messages may be sent to the wrong client. Socket.io messages that is so transcribed recordings as well login ones. This only an issue if more than one person logs in.

## ALSO DO NOT USE THIS SERVER IN PRODUCTION AS IS.

- it only uses express's built in memory store so all user data is destoryed when the server is restarted

- It doesn't use httponly for its session cookies so session hijacking (and thus message stealing) is possible

- again auth is broken so logins could get mixed up and different people could get each others messages if multple people login.
