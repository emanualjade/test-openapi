'use strict'

const stringWidth = require('string-width')
const sliceAnsi = require('slice-ansi')

// If reported value is too big, we truncate it
const truncate = function(string) {
  // We use `string-width` to ignore width taken by ANSI sequences coming from
  // syntax highlighting done by `plugin.report()`
  if (stringWidth(string) <= MAX_BODY_SIZE) {
    return string
  }

  // We use `slice-ansi` to avoid truncating in the middle of ANSI sequences
  // which produces weird characters.
  // TODO: fix, `slice-ansi` is pretty slow
  const start = sliceAnsi(string, 0, MAX_BODY_SIZE)
  const end = sliceAnsi(string, MAX_BODY_SIZE)

  const lastLine = getLastLine({ end })

  const stringA = `${start}${lastLine}\n`
  return stringA
}

// We keep the last line non-truncated as it's more user-friendly
const getLastLine = function({ end }) {
  const lastLine = findLastLine({ end })

  // If the last line is too big, we still truncate it
  if (stringWidth(lastLine) > MAX_BODY_LINE_SIZE) {
    return ''
  }

  return lastLine
}

const findLastLine = function({ end }) {
  const index = end.indexOf('\n')

  if (index === -1) {
    return end
  }

  return end.substr(0, index)
}

const MAX_BODY_SIZE = 1e4
const MAX_BODY_LINE_SIZE = 1e3

module.exports = {
  truncate,
}
