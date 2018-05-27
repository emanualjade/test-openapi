'use strict'

const yargs = require('yargs')

const defineCli = function() {
  return yargs
    .options(CONFIG)
    .usage(USAGE)
    .example(RUN_EXAMPLE, 'Run tasks')
    .help()
    .version()
    .strict()
}

const CONFIG = {
  call: {
    describe: 'HTTP call options',
  },
  'call.server': {
    string: true,
    alias: 'u',
    requiresArg: true,
    describe: 'Server URL',
  },
  // Timeout for both:
  //  - sending and receiving each HTTP request
  //  - parsing the HTTP response
  // I.e. this is the timeout for a single task, but excluding the time its `deps` take
  // 0 to disable
  'call.timeout': {
    number: true,
    alias: 't',
    requiresArg: true,
    describe: 'Maximum time to wait for each HTTP call',
  },
  spec: {
    string: true,
    alias: 's',
    requiresArg: true,
    describe: 'File path or URL to the OpenAPI specification',
  },
  // Number of times each `it()` is repeated (each time with new random parameters)
  repeat: {
    number: true,
    alias: 'r',
    requiresArg: true,
    describe: 'Number of times each task is repeated',
  },
  dry: {
    boolean: true,
    alias: 'd',
    describe: 'Only validate tasks syntax instead of performing them.',
    // Otherwises defaults to `false`
    default: undefined,
  },
}

const USAGE = `$0 [OPTS] [TASKS_FILES...]

Automated client requests

TASKS_FILES... are JSON or YAML files containing the tasks to perform.
Can include globbing patterns.
Defaults to any file ending with 'spec.yml|json' or 'tasks.yml.json'`

const RUN_EXAMPLE = '$0 --spec ./openapi.yml --call.server http://localhost:5001 ./**/*.tasks.yml'

module.exports = {
  defineCli,
}
