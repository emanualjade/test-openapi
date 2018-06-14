'use strict'

// Indent value if multi-line
const indentValue = function({ string }) {
  if (!shouldIndent({ string })) {
    return string
  }

  return indent(`\n${string}`)
}

// Indent multi-line stringds
const shouldIndent = function({ string }) {
  return string.includes('\n')
}

// Indent a string
const indent = function(string) {
  return string.replace(/\n/g, `\n${INDENT}`)
}

const fullIndent = function(string) {
  return string.replace(/\n|^/g, `\n${INDENT}`)
}

const INDENT_SIZE = 2
const INDENT = ' '.repeat(INDENT_SIZE)

module.exports = {
  indentValue,
  indent,
  fullIndent,
}
