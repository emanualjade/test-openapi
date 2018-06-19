'use strict'

const stringWidth = require('string-width')

const { gray } = require('./colors')

// If reported value is too big, we truncate it
const truncate = function(value) {
  // We use `string-width` to ignore width taken by ANSI sequences coming from
  // syntax highlighting done by `plugin.report()`
  const isTruncated = stringWidth(value) > MAX_BODY_SIZE

  const valueA = truncateValue({ value, isTruncated })
  return { value: valueA, isTruncated }
}

const truncateValue = function({ value, isTruncated }) {
  if (!isTruncated) {
    return value
  }

  const start = value.substr(0, MAX_BODY_SIZE)
  const end = value.substr(MAX_BODY_SIZE)

  const lastLine = getLastLine({ end })

  return `${start}${lastLine}`
}

// We keep the last line non-truncated as it's more user-friendly
const getLastLine = function({ end }) {
  const nextNewlineIndex = end.indexOf('\n')
  const lastLine = end.substr(0, nextNewlineIndex + 1)

  // If the last line is too big, we still truncate it
  if (stringWidth(lastLine) > MAX_BODY_LINE_SIZE) {
    return '\n'
  }

  return lastLine
}

const MAX_BODY_SIZE = 5e3
const MAX_BODY_LINE_SIZE = 1e3

// We add `...` after truncation. This must be done after syntax highlighting,
// otherwise it interfers with it.
const addTruncateDots = function({ value, isTruncated }) {
  if (!isTruncated) {
    return value
  }

  return `${value}${gray('...')}`
}

module.exports = {
  truncate,
  addTruncateDots,
}
