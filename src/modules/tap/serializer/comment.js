'use strict'

const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP comment
const comment = function(comment) {
  checkArgument(comment, 'string')

  return write(this, `# ${comment}`)
}

module.exports = {
  comment,
}
