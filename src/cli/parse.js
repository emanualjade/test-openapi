'use strict'

const { omit, omitBy } = require('lodash')

const parseOpts = function({ yargs }) {
  const { _: posOpts, ...opts } = yargs.parse()
  // `yargs`-specific options
  const optsA = omit(opts, ['help', 'version', '$0'])
  // Remove shortcuts
  const optsB = omitBy(optsA, (value, name) => name.length === 1)
  const tests = posOpts.length === 0 ? undefined : posOpts
  return { ...optsB, tests }
}

module.exports = {
  parseOpts,
}
