'use strict'

const { runTests } = require('./run')

// Main entry point of integration tests definition
const defineTests = function({ opts, opts: { tests } }) {
  // Define all tests with `it()`
  describe(DESCRIBE_TITLE, function() {
    tests.map(test => defineTest({ test, opts }))
  })
}

const DESCRIBE_TITLE = 'Integration tests'

// Define a single test with `it()`
const defineTest = function({ test: { title, ...test }, opts }) {
  // This means `this` context is lost.
  // We can remove the arrow function if we ever need the context.
  // Timeout is handled differently (i.e. not by the test runner)
  it(title, () => runTests({ test, opts }), 0)
}

module.exports = {
  defineTests,
}
