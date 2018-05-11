'use strict'

const { getPaddings, getTestTitle } = require('./title')

// Define all tests with `it()`
const defineTests = function({ tests, opts, runTest }) {
  const paddings = getPaddings({ tests })

  describe('Integration tests', function() {
    tests.forEach(test => defineTest({ test, opts, runTest, paddings }))
  })
}

// Define a single test with `it()`
const defineTest = function({ test, opts, opts: { timeout }, runTest, paddings }) {
  const title = getTestTitle({ test, paddings })
  const testFunc = runTests.bind(null, { test, opts, runTest })

  it(title, testFunc, timeout)
}

// Repeat each test `opts.repeat` times, each time with different random parameters
// It will only show as a single `it()`
// Run all tests in parallel for performance reason
// If a single one fails though, whole `it()` will stop and report that one failure
// TODO: we should cancel other tests if any of them fails. At the moment, this is
// not possible because `node-fetch` does not support `AbortController`:
// a PR is ongoing to add support: https://github.com/bitinn/node-fetch/pull/437
const runTests = async function({ test, opts, opts: { repeat }, runTest }) {
  const runningTests = new Array(repeat).fill().map(() => runTest({ test, opts }))
  await Promise.all(runningTests)
}

module.exports = {
  defineTests,
}
