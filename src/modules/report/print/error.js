'use strict'

const { red, dim, indent, HORIZONTAL_LINE } = require('../utils')
const { getErrorProps } = require('../error_props')

const { printErrorProps } = require('./error_props')

// Retrieve task's error to print
const getErrorMessage = function({
  task,
  task: {
    key,
    error: { message },
  },
  plugins,
}) {
  const { title, errorProps } = getErrorProps({ task, plugins })

  const errorPropsA = printErrorProps({ errorProps })

  return `
${HORIZONTAL_LINE}
${CROSS_MARK} ${red.bold(key)}

${dim(indent(title))}

${indent(message)}
${HORIZONTAL_LINE}

${indent(errorPropsA)}
`
}

// Red cross symbol
const CROSS_MARK = red.bold('\u2718')

module.exports = {
  getErrorMessage,
}
