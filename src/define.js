'use strict'

const { getOpts } = require('./opts')
const { getTests } = require('./tests')
const { defineTests } = require('./runner')
const { replaceDeps } = require('./deps')
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
const runTest = async function({ tests, test, opts }) {
  // Replace all `deps`, i.e. references to other tests.
  // Pass `runTest` for recursion.
  const testA = await replaceDeps({ tests, test, runTest, opts })

  // Send an HTTP request to the endpoint
  const { fetchOpts, res } = await sendRequest({ test: testA, opts })

  // Validates that the HTTP response matches the endpoint OpenAPI specification
  const response = await validateResponse({ test: testA, fetchOpts, res })

  // Return value if this test was a `dep`
  return { response }
}

defineIntegrationTests()
