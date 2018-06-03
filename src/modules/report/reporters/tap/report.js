'use strict'

const Colorize = require('tap-colorize')

// TAP reporter
const report = function({ colors = true }, stream) {
  if (colors === false) {
    return
  }

  const colorize = Colorize()
  colorize.pipe(stream)
  return colorize
}

module.exports = {
  report,
}
