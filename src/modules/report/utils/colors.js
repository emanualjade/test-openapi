'use strict'

const chalk = require('chalk')

// Colors used in reporting
const { reset, red, dim, yellow, magenta, italic, bold, inverse } = chalk
const orange = chalk.rgb(250, 100, 50)
const grey = chalk.rgb(150, 150, 150)

module.exports = {
  reset,
  red,
  dim,
  grey,
  yellow,
  magenta,
  orange,
  italic,
  bold,
  inverse,
}
