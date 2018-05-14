'use strict'

const { getOpts } = require('./opts')
const { runTests } = require('./run')

// Main entry point of integration tests definition
const defineTests = function() {
  // Retrieve main options
  const opts = getOpts()

  // Define all tests with `it()`
  describe(DESCRIBE_TITLE, function() {
    opts.tests.map(test => defineTest({ test, opts }))
  })
}

const DESCRIBE_TITLE = 'Integration tests'

// Define a single test with `it()`
const defineTest = function({ test: { title, ...test }, opts, opts: { timeout } }) {
  it(title, () => runTests({ test, opts }), timeout)
}

module.exports = {
  defineTests,
}
