Welcome to the node twilio scriber.

Its a little web app that allows one to record voice messages using a twilio account

it uses node.js of course
- express.js
- node - twilio (with added demo support)
- socket.io

among other things


usages.


run 

node server.js



ALSO DO NOT USE THIS SERVER IN PRODUCTION AS IS.

- it only uses express's built in memory store so all user data is destoryed when the server is restarted

- It doesn't use httponly for its session cookies so session hijacking (and thus message stealing) is possible

