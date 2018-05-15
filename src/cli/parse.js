'use strict'

const { omit } = require('lodash')

const parseOpts = function({ yargs }) {
  const { _: posOpts, ...opts } = yargs.parse()
  // `yargs`-specific options
  const optsA = omit(opts, ['help', 'version', '$0'])
  return { ...optsA, tests: posOpts }
}

module.exports = {
  parseOpts,
}
