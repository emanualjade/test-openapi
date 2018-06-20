'use strict'

const stringWidth = require('string-width')

// If reported value is too big, we truncate it
const truncate = function(string) {
  // We use `string-width` to ignore width taken by ANSI sequences coming from
  // syntax highlighting done by `plugin.report()`
  if (stringWidth(string) <= MAX_BODY_SIZE) {
    return string
  }

  const start = string.substr(0, MAX_BODY_SIZE)
  const end = string.substr(MAX_BODY_SIZE)

  const lastLine = getLastLine({ end })

  const stringA = `${start}${lastLine}...`
  return stringA
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

const MAX_BODY_SIZE = 1e4
const MAX_BODY_LINE_SIZE = 1e3

module.exports = {
  truncate,
}
