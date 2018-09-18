'use strict'

const { checkArgument } = require('./check')

// TAP comment
const comment = function({ colors }, commentString) {
  checkArgument(commentString, 'string')

  return colors.comment(`# ${comment}\n\n`)
}

module.exports = {
  comment,
}
