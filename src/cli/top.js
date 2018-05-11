'use strict'

const yargs = require('yargs')

const defineTopOptions = function() {
  return (
    yargs
      .commandDir('./commands')
      // There should be a single instruction, or none (default one)
      .demandCommand(1, 1)
      .usage(USAGE)
      .help()
      .version()
      .recommendCommands()
      .strict()
  )
}

const USAGE = `test-openapi [INSTRUCTION] [OPTS]

OpenAPI automatic integration testing`

module.exports = {
  defineTopOptions,
}
