'use strict'

const LINE_SIZE = 78

// Horizontal line between sections
const HORIZONTAL_LINE = '\u2500'.repeat(LINE_SIZE)

// Full blocks filling lower|upper half of the line
const FULL_LOWER_LINE = '\u2584'.repeat(LINE_SIZE)
const FULL_UPPER_LINE = '\u2580'.repeat(LINE_SIZE)

module.exports = {
  HORIZONTAL_LINE,
  FULL_LOWER_LINE,
  FULL_UPPER_LINE,
  LINE_SIZE,
}
