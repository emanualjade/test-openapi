'use strict'

const { getResultType } = require('../../../utils')
const { getReportProps } = require('../../../props')

const { getHeader } = require('./header')
const { printReportProps } = require('./report_props')

// Print task errors and update spinner
const complete = function(task, { options: { spinner }, silent, ...context }) {
  if (silent) {
    return ''
  }

  spinner.clear()

  const message = getMessage({ task, context })
  return message
}

// Retrieve task's message to print
const getMessage = function({ task, context }) {
  const resultType = getResultType(task)

  const { titles, reportProps } = getReportProps({ task, context })

  const header = getHeader({ task, titles, resultType })

  const reportPropsA = printReportProps({ reportProps, resultType })

  return `\n${header}${reportPropsA}\n`
}

module.exports = {
  complete,
}
