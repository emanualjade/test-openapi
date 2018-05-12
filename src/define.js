'use strict'

const { getOpts } = require('./opts')
const { getTests } = require('./tests')
const { defineTests } = require('./runner')

// Main entry point of integration tests definition
const defineIntegrationTests = function() {
  // Retrieve main options
  const opts = getOpts()

  // Retrieve all tests inputs for all endpoints
  const tests = getTests({ opts })

  // Define each `it()` test
  defineTests({ tests, opts })
}

defineIntegrationTests()
