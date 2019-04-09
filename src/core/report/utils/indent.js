// Indent value if multi-line
export const indentValue = function(string) {
  if (!shouldIndent(string)) {
    return string
  }

  // Multi-line strings should be on next line
  const stringA = string.replace(/^\n*/u, '\n')

  return indent(stringA)
}

// Indent multi-line stringds
const shouldIndent = function(string) {
  return string.includes('\n')
}

// Indent a string
export const indent = function(string, extraIndent = 0) {
  const size = INDENT_SIZE + extraIndent
  const indentString = ' '.repeat(size)
  return indentString + String(string).replace(/\n/gu, `\n${indentString}`)
}

const INDENT_SIZE = 2
