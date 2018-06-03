'use strict'

const { red, indent } = require('../../../utils')

const { getHeader } = require('./header')
const { getErrorProps } = require('./props')

// Retrieve task's error to print
const getErrorMessage = function({ task, error }) {
  const header = getHeader({ task, error })
  const errorProps = getErrorProps({ error })
  const message = `${header}\n\n${errorProps}`
  const messageA = indent(message)
  return `\n${CROSS_MARK} ${messageA}\n`
}

// Red cross symbol
const CROSS_MARK = red.bold('\u2718')

module.exports = {
  getErrorMessage,
}
