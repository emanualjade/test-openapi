'use strict'

const { grey } = require('./colors')

// Horizontal line between sections
const HORIZONTAL_LINE_SIZE = 78
const HORIZONTAL_LINE = grey('\u2500'.repeat(HORIZONTAL_LINE_SIZE))

module.exports = {
  HORIZONTAL_LINE,
}
