import { gray, red, green, HORIZONTAL_LINE } from '../../utils.js'

const MARKS = {
  // Pause symbol
  skip: '\u23F8',
  // Check symbol
  pass: '\u2714',
  // Cross symbol
  fail: '\u2718',
}

const COLORS = {
  skip: gray,
  pass: green,
  fail: red,
}

const NAMES = {
  skip: 'Skipped: ',
  pass: 'Passed:  ',
  fail: 'Failed:  ',
}

const LINE = `\n${gray(HORIZONTAL_LINE)}\n`

module.exports = {
  MARKS,
  COLORS,
  NAMES,
  LINE,
}
