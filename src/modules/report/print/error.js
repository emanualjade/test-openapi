'use strict'

const { red, dim, indent, fullIndent, HORIZONTAL_LINE } = require('../utils')

const { getErrorProps } = require('./props')

// Retrieve task's error to print
const getErrorMessage = function({ task, error }) {
  const header = getHeader({ task, error })
  const errorProps = getErrorProps({ error })

  return `
${HORIZONTAL_LINE}
${CROSS_MARK} ${indent(header)}
${HORIZONTAL_LINE}

${fullIndent(errorProps)}
`
}

// Retrieve top of error printed message
const getHeader = function({ task: { key, title }, error: { message } }) {
  return `${red.bold(key)}
${dim(title)}

${message}`
}

// Red cross symbol
const CROSS_MARK = red.bold('\u2718')

module.exports = {
  getErrorMessage,
}
