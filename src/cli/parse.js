'use strict'

const { omit } = require('lodash')

const { COMMANDS } = require('./trigger')

const parseOpts = function({ yargs }) {
  const { _: otherOpts, ...opts } = yargs.parse()
  // `yargs`-specific options
  const optsA = omit(opts, ['help', 'version', '$0'])
  const { command, posOpts } = parseCommand(otherOpts)
  return { command, opts: optsA, posOpts }
}

const parseCommand = function([command, ...posOpts]) {
  if (COMMANDS[command] !== undefined) {
    return { command, posOpts }
  }

  if (command === undefined) {
    return { command: 'run' }
  }

  return { command: 'run', posOpts: [command, ...posOpts] }
}

module.exports = {
  parseOpts,
}
