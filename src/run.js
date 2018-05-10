'use strict'

const { loadOpenApiSpec } = require('./load')
const { runTests } = require('./runner')

// Run integration testing
const runIntegration = async function({ spec, ...opts }) {
  // Retrieve OpenAPI specification
  const specA = await loadOpenApiSpec({ path: spec })

  setOpts({ spec: specA, ...opts })

  try {
    await new Promise(runTests)
  } finally {
    unsetOpts()
  }
}

// Test files are `require()`'d by Jasmine.
// So we need to pass information to them by setting global variables
const setOpts = function(integration) {
  global[Symbol.for('integration')] = integration
}

const unsetOpts = function() {
  delete global[Symbol.for('integration')]
}

module.exports = {
  runIntegration,
}
