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

## Known Issues

### Right now it is VERY much a work in progress. 

- When call you to confirm recording and its supposed to saves your number to a cookie you have to refesh the homepage once to get it work properly

- the recording page is just a wireframe right now. It shows where stuff will go but doesn't do actual recording yet



## ALSO DO NOT USE THIS SERVER IN PRODUCTION AS IS.

- it only uses express's built in memory store so all user data is destoryed when the server is restarted

- It doesn't use httponly for its session cookies so session hijacking (and thus message stealing) is possible

