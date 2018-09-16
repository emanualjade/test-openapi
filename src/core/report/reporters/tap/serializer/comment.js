'use strict'

const { checkArgument } = require('./check')

// TAP comment
const comment = function(commentString) {
  checkArgument(commentString, 'string')

  return this.colors.comment(`# ${comment}\n\n`)
}

module.exports = {
  comment,
}
