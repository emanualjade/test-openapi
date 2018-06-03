'use strict'

const chalk = require('chalk')

// Colors used in reporting
const { red, dim, yellow } = chalk
const orange = chalk.rgb(250, 100, 50)
const grey = chalk.rgb(150, 150, 150)

module.exports = {
  red,
  dim,
  grey,
  yellow,
  orange,
}
