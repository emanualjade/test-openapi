'use strict'

// Indent value if multi-line
const indentValue = function(string) {
  if (!shouldIndent(string)) {
    return string
  }

  // Multi-line strings should be on next line
  const stringA = string.replace(/^\n*/, '\n')

  return indent(stringA)
}

// Indent multi-line stringds
const shouldIndent = function(string) {
  return string.includes('\n')
}

// Indent a string
const indent = function(string) {
  return INDENT + string.replace(/\n/g, `\n${INDENT}`)
}

const INDENT_SIZE = 2
const INDENT = ' '.repeat(INDENT_SIZE)

module.exports = {
  indentValue,
  indent,
}
