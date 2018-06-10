'use strict'

const { highlight, highlightAuto } = require('emphasize')

// Syntax highlighting
const highlightValue = function({ string, value, format }) {
  // Not performed on strings, unless `format` was specified
  if (typeof value === 'string' && format === undefined) {
    return string
  }

  // Non-strings are highlighted as YAML, unless `errorProp.format` was explicited
  const formatA = format || 'yaml'

  return highlight(formatA, string).value
}

// Console (ANSI sequences) syntax color highlighting
// Automatically guesses MIME type/format
const highlightValueAuto = function(string) {
  return highlightAuto(string).value
}

module.exports = {
  highlightValue,
  highlightValueAuto,
}
