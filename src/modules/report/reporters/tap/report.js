'use strict'

const colorize = require('tap-colorize')

// TAP reporter
const report = function({ options: { colors = true } }) {
  if (colors === false) {
    return
  }

  return colorize()
}

module.exports = {
  report,
}
