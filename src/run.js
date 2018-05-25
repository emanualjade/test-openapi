'use strict'

const { addErrorHandler, runTestsHandler } = require('./errors')
const { replaceDeps, handleDepError } = require('./deps')
const { mergeTest } = require('./merge')
const { generateRequest } = require('./generate')
const { sendRequest } = require('./request')
const { validateResponse } = require('./response')

// Repeat each test `opts.repeat` times, each time with different random parameters
// It will only show as a single `it()`
// Run all tests in parallel for performance reason
// If a single one fails though, whole `it()` will stop and report that one failure
// TODO: we should cancel other tests if any of them fails. At the moment, this is
// not possible because `node-fetch` does not support `AbortController`:
// a PR is ongoing to add support: https://github.com/bitinn/node-fetch/pull/437
const runTests = async function({ test, opts, opts: { repeat } }) {
  const runningTests = new Array(repeat).fill().map(() => runTest({ test, opts }))
  await Promise.all(runningTests)
}

const eRunTests = addErrorHandler(runTests, runTestsHandler)

// Run an `it()` test
const runTest = async function({
  test,
  test: {
    operation: { method, path },
  },
  opts,
}) {
  // Replace all `deps`, i.e. references to other tests.
  // Pass `runTest` for recursion.
  const testA = await replaceDeps({ test, opts, runTest: depsRunTest })

  // Merge test options with specification
  const { request, response } = mergeTest({ test: testA })

  // Generates random request parameters based on JSON schema
  const requestA = generateRequest({ request })

  // Send an HTTP request to the endpoint
  const { fetchRequest, fetchResponse, normRequest } = await sendRequest({
    method,
    path,
    request: requestA,
    opts,
  })

  // Validates that the HTTP response matches the endpoint OpenAPI specification
  const normResponse = validateResponse({
    request: normRequest,
    response,
    fetchRequest,
    fetchResponse,
    opts,
  })

  // Return value if this test was a `dep`
  return { request: normRequest, response: normResponse }
}

const depsRunTest = addErrorHandler(runTest, handleDepError)

module.exports = {
  runTests: eRunTests,
}
