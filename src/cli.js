'use strict'

const yargs = require('yargs')

const { runIntegration } = require('./run')

// Parse CLI arguments then run integration tests
const runCli = async function() {
  yargs
    .options(OPTIONS)
    .help()
    .usage(USAGE)
    .version()
    .strict()
  const opts = yargs.parse()
  await runIntegration(opts)
}

const OPTIONS = {
  spec: {
    string: true,
    alias: 's',
    requiresArg: true,
    demandOption: true,
    describe: 'Path to the OpenAPI specification',
  },
  server: {
    string: true,
    requiresArg: true,
    describe: 'URL of the server to test',
  },
  repeat: {
    integer: true,
    alias: 'r',
    requiresArg: true,
    describe: 'Number of times each test is repeated',
  },
}

const USAGE = 'testopenapi --spec PATH_TO_OPENAPI --server SERVER_URL'

module.exports = {
  runCli,
}
