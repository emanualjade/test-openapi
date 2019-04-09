import { checkArgument } from './check.js'

// TAP comment
const comment = function({ colors }, commentString) {
  checkArgument(commentString, 'string')

  return colors.comment(`# ${comment}\n\n`)
}

module.exports = {
  comment,
}
