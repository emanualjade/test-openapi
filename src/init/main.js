'use strict'

const { loadOpts } = require('../opts')
const { addErrorHandler, topNormalizeHandler } = require('../errors')

const { launchRunner } = require('./runner')

// Run integration testing
const runIntegration = async function(opts) {
  const optsA = await loadOpts(opts)

  await launchRunner({ opts: optsA })

  return { opts: optsA }
}

const eRunIntegration = addErrorHandler(runIntegration, topNormalizeHandler)

module.exports = {
  runIntegration: eRunIntegration,
}
