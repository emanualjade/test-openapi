'use strict'

const chalk = require('chalk')

// Colors used in reporting
const { red, dim, yellow, magenta, reset, italic, bold, inverse } = chalk

const orange = chalk.rgb(250, 100, 50)
const gray = chalk.rgb(150, 150, 150)
const darkGrey = chalk.rgb(100, 100, 100)
const darkRed = chalk.rgb(200, 0, 0)
const darkGreen = chalk.rgb(0, 150, 0)

module.exports = {
  red,
  dim,
  yellow,
  magenta,
  orange,
  gray,
  darkGrey,
  darkRed,
  darkGreen,

  reset,
  italic,
  bold,
  inverse,
}
