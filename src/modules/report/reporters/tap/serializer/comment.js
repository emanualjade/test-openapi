'use strict'

const { checkArgument } = require('./check')

// TAP comment
const comment = function(comment) {
  checkArgument(comment, 'string')

  return this.colors.gray(`# ${comment}\n\n`)
}

module.exports = {
  comment,
}
