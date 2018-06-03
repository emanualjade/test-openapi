'use strict'

const { assert } = require('./assert')
const { checkArgument } = require('./check')

// TAP test, i.e. group of asserts
// TODO: make it work with `keys` (ordered output)
const test = function(testName, asserts = []) {
  checkArgument(testName, 'string')

  const testHeader = `# ${testName}`

  const assertsString = asserts.map(assertOpts => assert.call(this, assertOpts))

  const testString = [testHeader, ...assertsString].join('\n\n')

  return `${testString}\n\n`
}

module.exports = {
  test,
}
