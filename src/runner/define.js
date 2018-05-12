'use strict'

const { replaceDeps } = require('../deps')
const { sendRequest } = require('../request')
const { validateResponse } = require('../response')
const { getPaddings, getTestTitle } = require('./title')

// Define all tests with `it()`
const defineTests = function({ tests, opts }) {
  const paddings = getPaddings({ tests })

  describe(DESCRIBE_TITLE, function() {
    tests.forEach(test => defineTest({ tests, test, opts, paddings }))
  })
}

const DESCRIBE_TITLE = 'Integration tests'

// Define a single test with `it()`
const defineTest = function({ tests, test, opts, opts: { timeout }, paddings }) {
  const title = getTestTitle({ test, paddings })
  const testFunc = runTests.bind(null, { tests, test, opts, runTest })

  it(title, testFunc, timeout)
}

// Repeat each test `opts.repeat` times, each time with different random parameters
// It will only show as a single `it()`
// Run all tests in parallel for performance reason
// If a single one fails though, whole `it()` will stop and report that one failure
// TODO: we should cancel other tests if any of them fails. At the moment, this is
// not possible because `node-fetch` does not support `AbortController`:
// a PR is ongoing to add support: https://github.com/bitinn/node-fetch/pull/437
const runTests = async function({ tests, test, opts, opts: { repeat }, runTest }) {
  const runningTests = new Array(repeat).fill().map(() => runTest({ tests, test, opts }))
  await Promise.all(runningTests)
}

// Run an `it()` test
const runTest = async function({ tests, test, opts }) {
  // Replace all `deps`, i.e. references to other tests.
  // Pass `runTest` for recursion.
  const testA = await replaceDeps({ tests, test, runTest, opts })

  // Send an HTTP request to the endpoint
  const { fetchRequest, fetchResponse, request } = await sendRequest({ test: testA, opts })

  // Validates that the HTTP response matches the endpoint OpenAPI specification
  const response = await validateResponse({ test: testA, fetchRequest, fetchResponse })

  // Return value if this test was a `dep`
  return { request, response }
}

module.exports = {
  defineTests,
}
