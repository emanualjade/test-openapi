'use strict'

const { runTests } = require('./run')

// Main entry point of integration tests definition
const defineTests = function({ opts, errors }) {
  // Define all tests with `it()`
  describe(DESCRIBE_TITLE, () => defineAllTests({ opts, errors }))
}

const DESCRIBE_TITLE = 'Integration tests'

const defineAllTests = function({ opts, opts: { tests }, errors }) {
  tests.map(test => defineTest({ test, opts, errors }))
}

// Define a single test with `it()`
const defineTest = function({ test: { title, ...test }, opts, errors }) {
  // This means `this` context is lost.
  // We can remove the arrow function if we ever need the context.
  // Timeout is handled differently (i.e. not by the test runner)
  it(title, () => runTests({ test, opts, errors }), 0)
}

module.exports = {
  defineTests,
}
