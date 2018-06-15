'use strict'

const { getResultType } = require('../../../utils')
const { getReportProps } = require('../../../props')

const { getHeader } = require('./header')
const { printReportProps } = require('./report_props')

// Print task errors and update spinner
const complete = function({ options: { spinner }, ...task }, { plugins, silent }) {
  spinner.update({ clear: true })

  if (silent) {
    return ''
  }

  const message = getMessage({ task, plugins })
  return message
}

// Retrieve task's message to print
const getMessage = function({ task, plugins }) {
  const resultType = getResultType(task)

  const { title, reportProps } = getReportProps({ task, plugins })

  const header = getHeader({ task, title, resultType })

  const reportPropsA = printReportProps({ task, reportProps, resultType })

  return `\n${header}${reportPropsA}\n`
}

module.exports = {
  complete,
}
