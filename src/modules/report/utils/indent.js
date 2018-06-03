'use strict'

// Indent value if `errorProp.indented: true`
const indentValue = function({ string, indented }) {
  if (!indented) {
    return string
  }

  return indent(`\n${string}`)
}

// Indent a string
const indent = function(string) {
  return string.replace(/\n/g, `\n${INDENT}`)
}

const fullIndent = function(string) {
  return `${INDENT}${indent(string)}`
}

const INDENT_SIZE = 2
const INDENT = ' '.repeat(INDENT_SIZE)

module.exports = {
  indentValue,
  indent,
  fullIndent,
}
