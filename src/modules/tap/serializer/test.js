'use strict'

const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP test title, used to group asserts
const test = function(testName) {
  checkArgument(testName, 'string')

  return write(this, `# ${testName}`)
}

module.exports = {
  test,
}
