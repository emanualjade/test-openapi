'use strict'

const { getResultType } = require('../../../utils')
const { getReportProps } = require('../../../props')

const { getHeader } = require('./header')
const { printReportProps } = require('./report_props')

// Print task errors and update spinner
const complete = function(
  { options: { spinner }, ...task },
  { config, startData, plugins, silent },
) {
  if (silent) {
    return ''
  }

  spinner.clear()

  const message = getMessage({ task, config, startData, plugins })
  return message
}

// Retrieve task's message to print
const getMessage = function({ task, config, startData, plugins }) {
  const resultType = getResultType(task)

  const { title, reportProps } = getReportProps({ task, config, startData, plugins })

  const header = getHeader({ task, title, resultType })

  const reportPropsA = printReportProps({ reportProps, resultType })

  return `\n${header}${reportPropsA}\n`
}

module.exports = {
  complete,
}
