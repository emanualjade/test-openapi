'use strict'

const { loadOpts, setOpts, unsetOpts } = require('./opts')
const { runTests } = require('./runner')

// Run integration testing
const runIntegration = async function(opts) {
  const optsA = await loadOpts(opts)
  await setOpts(optsA)

  try {
    await new Promise(runTests)
  } finally {
    unsetOpts()
  }
}

module.exports = {
  runIntegration,
}
