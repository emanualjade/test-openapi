'use strict'

const { getPaddings, getTestTitle } = require('./title')

// Define all tests with `it()`
const defineTests = function({ tests, opts, performTest }) {
  const paddings = getPaddings({ tests })

  describe('Integration tests', function() {
    tests.forEach(test => defineTest({ test, opts, performTest, paddings }))
  })
}

// Define a single test with `it()`
const defineTest = function({ test, opts, opts: { timeout }, performTest, paddings }) {
  const title = getTestTitle({ test, paddings })
  const testFunc = performTests.bind(null, { test, opts, performTest })

  it(title, testFunc, timeout)
}

// Repeat each test `opts.repeat` times, each time with different random parameters
// It will only show as a single `it()`
// Run all tests in parallel for performance reason
// If a single one fails though, whole `it()` will stop and report that one failure
// TODO: we should cancel other tests if any of them fails. At the moment, this is
// not possible because `node-fetch` does not support `AbortController`:
// a PR is ongoing to add support: https://github.com/bitinn/node-fetch/pull/437
const performTests = async function({ test, opts, opts: { repeat }, performTest }) {
  const runningTests = new Array(repeat).fill().map(() => performTest(test))
  await Promise.all(runningTests)
}

module.exports = {
  defineTests,
}
