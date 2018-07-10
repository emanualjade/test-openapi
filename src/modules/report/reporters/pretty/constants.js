'use strict'

const { gray, red, green } = require('../../utils')

const MARKS = {
  // Check symbol
  pass: '\u2714',
  // Cross symbol
  fail: '\u2718',
  // Pause symbol
  skip: '\u23f8',
}

const COLORS = {
  pass: green,
  fail: red,
  skip: gray,
}

const NAMES = {
  pass: 'Passed:  ',
  fail: 'Failed:  ',
  skip: 'Skipped: ',
}

module.exports = {
  MARKS,
  COLORS,
  NAMES,
}
