'use strict'

const { red, indent, fullIndent, HORIZONTAL_LINE } = require('../utils')

const { getHeader } = require('./header')
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

// Red cross symbol
const CROSS_MARK = red.bold('\u2718')

module.exports = {
  getErrorMessage,
}
