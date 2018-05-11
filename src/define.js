'use strict'

const { getOpts } = require('./opts')
const { getTests } = require('./tests')
const { defineTests } = require('./runner')
const { sendRequest } = require('./request')
const { validateResponse } = require('./response')

// Main entry point of integration tests definition
const defineIntegrationTests = function() {
  // Retrieve main options
  const opts = getOpts()

  // Retrieve all tests inputs for all endpoints
  const tests = getTests({ opts })

  // Define each `it()` test
  defineTests({ tests, opts, runTest })
}

// Run an `it()` test
const runTest = async function({ test, opts }) {
  // Send an HTTP request to the endpoint
  const { fetchOpts, res } = await sendRequest({ test, opts })

  // Validates that the HTTP response matches the endpoint OpenAPI specification
  await validateResponse({ test, fetchOpts, res })
}

defineIntegrationTests()
