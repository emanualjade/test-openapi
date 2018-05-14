'use strict'

const { loadOpts } = require('../opts')
const { launchRunner } = require('./runner')

// Run integration testing
const runIntegration = async function(opts) {
  const optsA = await loadOpts(opts)

  await new Promise(launchRunner.bind(null, optsA))
}

module.exports = {
  runIntegration,
}
