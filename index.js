const Client = require('castv2').Client;
const request = require('request');
const config = require('./config');

// Put the rules into a map
config.rules.forEach(each => {
  ondeviceup(each);
});

function ondeviceup(rule) {
  const client = new Client();
  client.connect(rule.address, function() {
    console.log(`Creating connection to ${rule.address}`);
    // create various namespace handlers
    var connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
    var heartbeat  = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');
    var receiver   = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

    // establish virtual connection to the receiver
    connection.send({ type: 'CONNECT' });

    // start heartbeating
    setInterval(function() {
      heartbeat.send({ type: 'PING' });
    }, 5000);

    var sessionId;

    // display receiver status updates
    receiver.on('message', function(data, broadcast) {
      if (data.type != 'RECEIVER_STATUS') {
        return;
      }

      if (!data.status.applications) {
        console.log('disconnect?');
      } else if (sessionId != data.status.applications[0].sessionId) {
        sessionId = data.status.applications[0].sessionId;
        console.log('new session! ' + sessionId);

        if (rule.webhook_start) {
          console.log('making request to ' + rule.webhook_start);
          request(rule.webhook_start);
        }
      } else {
        console.log('got some other message...');
      }
    });
  });
}
