'use strict'

const { checkArgument } = require('./check')

// TAP comment
const comment = function(comment) {
  checkArgument(comment, 'string')

  return `# ${comment}\n\n`
}

module.exports = {
  comment,
}
