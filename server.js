const yargs = require('yargs');
const Client = require('./src/client');

// Parse command line arguments with yargs
const argv = yargs
  .option('host', {
    alias: 'h',
    describe: 'cast device to watch',
    type: 'string',
    demandOption: true,
  })
  .option('onStart', {
    alias: 's',
    describe: 'webhook to call when a session starts',
    type: 'string',
  })
  .option('onEnd', {
    alias: 'e',
    describe: 'webhook to call when a session ends',
    type: 'string',
  })
  .argv;

// Here we go!
const client = new Client({
  host: argv.host,
  onStart: argv.onStart,
  onEnd: argv.onEnd,
});
client.start();
