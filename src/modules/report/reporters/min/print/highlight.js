'use strict'

const { highlightAuto } = require('emphasize')

// Syntax highlighting if `errorProp.highlighted: true`
const highlightValue = function({ string, highlighted }) {
  if (!highlighted) {
    return string
  }

  return highlight(string)
}

// Console (ANSI sequences) syntax color highlighting
// Automatically guesses MIME type/format
const highlight = function(string) {
  return highlightAuto(string).value
}

module.exports = {
  highlightValue,
  highlight,
}
