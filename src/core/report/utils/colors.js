'use strict'

const chalk = require('chalk')
const stripAnsi = require('strip-ansi')
const { mapValues } = require('lodash')

const { isObject } = require('../../../utils')

// Colors used in reporting
const { yellow, magenta, reset, italic, bold, inverse } = chalk

// eslint-disable-next-line no-magic-numbers
const red = chalk.rgb(200, 0, 0)
// eslint-disable-next-line no-magic-numbers
const green = chalk.rgb(0, 150, 0)
// eslint-disable-next-line no-magic-numbers
const gray = chalk.rgb(100, 100, 100)
// eslint-disable-next-line no-magic-numbers
const orange = chalk.rgb(250, 100, 50)

// Utility function
const removeColors = function(value) {
  if (isObject(value)) {
    return mapValues(value, removeColors)
  }

  return stripAnsi(value)
}

module.exports = {
  // Main colors, e.g. for fail, pass and skip|comment
  red,
  green,
  gray,

  // Top-level keys
  orange,
  // Nested keys
  yellow,
  // Non-string values
  magenta,
  // String values
  reset,

  // Modifiers
  italic,
  bold,
  inverse,

  // Utilities
  removeColors,
}
