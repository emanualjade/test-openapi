import { removeColors } from './colors.js'

// If reported value is too big, we truncate it
export const truncate = function(string) {
  if (string.length <= MAX_LENGTH) {
    return string
  }

  const stringA = addEllipsis(string)
  const stringB = removeAnsi(stringA)
  return stringB
}

const addEllipsis = function(string) {
  const stringA = string.slice(0, MAX_LENGTH)
  const bytesLeft = string.length - MAX_LENGTH
  const bytesLeftStr = `\n... ${bytesLeft} more bytes`
  const stringB = `${stringA}${bytesLeftStr}`
  return stringB
}

const MAX_LENGTH = 1e4

// We strip ANSI color sequences at the end because:
//  - if broken in the middle, they produce weird characters on the console
//  - they might colorize the "more bytes" string
// There are libraries like `slice-ansi` that do that but they are really
// slow. Current solution is quite fast.
const removeAnsi = function(string) {
  const stringStart = string.slice(0, ALMOST_MAX_LENGTH)
  const stringEnd = string.slice(ALMOST_MAX_LENGTH)
  const stringEndA = removeColors(stringEnd)
  const stringA = `${stringStart}${stringEndA}`
  return stringA
}

const LAST_CHARS_LENGTH = 20
const ALMOST_MAX_LENGTH = MAX_LENGTH - LAST_CHARS_LENGTH
