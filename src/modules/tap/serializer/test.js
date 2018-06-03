'use strict'

const { getAssert } = require('./assert')
const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP test, i.e. group of asserts
const test = function(testName, asserts = []) {
  checkArgument(testName, 'string')

  const testHeader = `# ${testName}`

  const assertsString = asserts.map(assert => getAssert(this, assert))

  const testString = [testHeader, ...assertsString].join('\n\n')

  return write(this, testString)
}

module.exports = {
  test,
}
