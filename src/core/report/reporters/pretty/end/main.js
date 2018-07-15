'use strict'

const { indent } = require('../../../utils')
const { LINE } = require('../constants')

const { printTasksList } = require('./list')
const { printSummary } = require('./summary')

// Clears spinner and print summarized tasks list and final counters message
const end = function({ options, options: { spinner }, tasks }) {
  spinner.stop()

  const endMessage = getEndMessage({ tasks, options })
  return endMessage
}

const getEndMessage = function({ tasks, options }) {
  const tasksList = printTasksList({ tasks, options })
  const summaryString = printSummary({ tasks })

  return `${LINE}
${tasksList}${indent(summaryString)}
${LINE}
`
}

module.exports = {
  end,
}
