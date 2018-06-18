'use strict'

const { getResultType } = require('../../../utils')
const { getReportProps } = require('../../../props')

const { getHeader } = require('./header')
const { printReportProps } = require('./report_props')

// Print task errors and update spinner
const complete = function({ options: { spinner }, ...task }, { config, plugins, silent }) {
  spinner.update({ clear: !silent })

  if (silent) {
    return ''
  }

  const message = getMessage({ task, config, plugins })
  return message
}

// Retrieve task's message to print
const getMessage = function({ task, config, plugins }) {
  const resultType = getResultType(task)

  const { title, reportProps } = getReportProps({ task, config, plugins })

  const header = getHeader({ task, title, resultType })

  const reportPropsA = printReportProps({ reportProps, resultType })

  return `\n${header}${reportPropsA}\n`
}

module.exports = {
  complete,
}
