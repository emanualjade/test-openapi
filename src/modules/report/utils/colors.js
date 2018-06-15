'use strict'

const chalk = require('chalk')

// Colors used in reporting
const { reset, red, green, dim, yellow, magenta, italic, bold, inverse } = chalk
const orange = chalk.rgb(250, 100, 50)
const grey = chalk.rgb(150, 150, 150)

module.exports = {
  reset,
  red,
  green,
  dim,
  grey,
  yellow,
  magenta,
  orange,
  italic,
  bold,
  inverse,
}
