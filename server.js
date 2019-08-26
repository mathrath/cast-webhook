const yargs = require('yargs');
const Client = require('./src/client');

// Parse command line arguments with yargs
const argv = yargs
  .env('CAST_WEBHOOK')  // Prefix for configuring by environment variable
  .option('host', {  // CAST_WEBHOOK_HOST
    alias: 'h',
    describe: 'cast device to watch',
    type: 'string',
    demandOption: true,
  })
  .option('start', {  // CAST_WEBHOOK_START
    alias: 's',
    describe: 'webhook to call when a session starts',
    type: 'string',
  })
  .option('end', {  // CAST_WEBHOOK_END
    alias: 'e',
    describe: 'webhook to call when a session ends',
    type: 'string',
  })
  .argv;

// Here we go!
const client = new Client({
  host: argv.host,
  onStart: argv.start,
  onEnd: argv.end,
});
client.start();
