const castv2Client = require('castv2').Client;
const request = require('request');

// TODO jsdoc would be nice

class Client {
  constructor(config) {
    this.host = config.host;
    this.onStart = config.onStart;
    this.onEnd = config.onEnd;

    this.lastSessionId = null;
  }

  start() {
    console.log(`Connecting to "${this.host}"...`);
    const client = new castv2Client();

    client.connect(this.host, () => {
      // Below is pretty much all taken from castv2's documentation
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

      receiver.on('message', this.onMessage.bind(this));

      console.log('Connected! Waiting for some action...');
    });
  }

  onMessage(data, broadcast) {
    if (data.type != 'RECEIVER_STATUS') {
      return;
    }

    // Session ended
    if (!data.status.applications) {
      console.log('Looks like a session ended');
      return this.callOnEndWebhook();
    }

    // Session started
    if (this.lastSessionId != data.status.applications[0].sessionId) {
      this.lastSessionId = data.status.applications[0].sessionId;
      console.log('New session: ' + this.lastSessionId);
      return this.callOnStartWebhook();
    }

    // Something else
    console.log('Got some other message...');
  }

  callOnStartWebhook() {
    if (!this.onStart) {
      return;
    }

    console.log('Making request to onStart webhook');
    Client.callWebhook(this.onStart);
  }

  callOnEndWebhook() {
    if (!this.onEnd) {
      return;
    }

    console.log('Making request to onEnd webhook');
    Client.callWebhook(this.onEnd);
  }

  static callWebhook(url) {
    // TODO check response
    // TODO maybe use got
    request(url);
  }
}

module.exports = Client;
