'use strict'

const { assert } = require('./assert')
const { checkArgument } = require('./check')

// TAP test, i.e. group of asserts
// TODO: make it work with `keys` (ordered output)
const test = function(testName, asserts = []) {
  checkArgument(testName, 'string')

  const testHeader = getTestHeader.call(this, { testName, asserts })

  const assertsString = asserts.map(assertOpts => assert.call(this, assertOpts))

  const testString = [testHeader, ...assertsString].join('\n\n')
  return testString
}

const getTestHeader = function({ testName, asserts }) {
  const color = getColor({ asserts })
  return this.colors[color](`# ${testName}`)
}

const getColor = function({ asserts }) {
  const failed = asserts.some(({ ok }) => !ok)
  if (failed) {
    return 'red'
  }

  return 'green'
}

module.exports = {
  test,
}
