'use strict'

const yargs = require('yargs')

const defineTopOptions = function() {
  return yargs
    .options(OPTIONS)
    .usage(USAGE)
    .example(RUN_EXAMPLE, 'Run tests')
    .help()
    .version()
    .strict()
}

const OPTIONS = {
  spec: {
    string: true,
    alias: 's',
    requiresArg: true,
    describe: 'Path to the OpenAPI specification',
  },
  server: {
    string: true,
    requiresArg: true,
    describe: 'URL of the server to test',
  },
  // Number of times each `it()` is repeated (each time with new random parameters)
  repeat: {
    number: true,
    alias: 'r',
    requiresArg: true,
    describe: 'Number of times each test is repeated',
  },
  // Timeout for both:
  //  - sending and receiving each HTTP request
  //  - parsing the HTTP response
  // I.e. this is the timeout for a single test, but excluding the time its `deps` take
  // 0 to disable
  timeout: {
    number: true,
    alias: 't',
    requiresArg: true,
    describe: 'Maximum time to wait for each HTTP request',
  },
  dry: {
    boolean: true,
    alias: 'd',
    describe: 'Only validate tests syntax instead of performing them.',
  },
}

const USAGE = `$0 [OPTS] [TEST_FILES...]

OpenAPI automatic integration testing

TEST_FILES... are JSON or YAML files containing the tests to perform.
Can include globbing patterns.
Defaults to any file ending with 'spec.yml|json' or 'test.yml.json'`

const RUN_EXAMPLE = '$0 --spec ./openapi.yml --server http://localhost:5001 ./tests/**/*.test.yml'

module.exports = {
  defineTopOptions,
}
