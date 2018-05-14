'use strict'

// Command `test-openapi run`
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
    number: true,
    alias: 'r',
    requiresArg: true,
    describe: 'Number of times each test is repeated',
  },
}

const TESTS_OPTION = {
  string: true,
  array: true,
  demandOption: true,
  describe: 'JSON or YAML files containing the tests to perform.\nCan include globbing patterns.',
}

const builder = function(runCommand) {
  return runCommand
    .options(OPTIONS)
    .positional('tests', TESTS_OPTION)
    .example('Running tests:', RUN_EXAMPLE)
}

const run = {
  command: 'run',
  describe: 'Run integration tests',
  builder,
  aliases: ['*'],
}

const RUN_EXAMPLE =
  'test-openapi --spec ./openapi.yml --server http://localhost:5001 ./tests/**/*.test.yml'

module.exports = run
