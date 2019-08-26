const config = require('./config');
const Client = require('./src/client');

// Put the rules into a map
config.rules.forEach(each => {
  ondeviceup(each);
});

config.rules.forEach(each => {
  const client = new Client({
    host: each.address,
    onStart: each.webhook_start,
    onEnd: each.webhook_end,
  });

  client.start();
});
