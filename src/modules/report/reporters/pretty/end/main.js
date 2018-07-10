'use strict'

const { indent } = require('../../../utils')
const { LINE } = require('../constants')

const { printTasksList } = require('./list')
const { printSummary } = require('./summary')

// Clears spinner and print summarized tasks list and final counters message
const end = function({ options: { spinner }, tasks, config }) {
  spinner.stop()

  const endMessage = getEndMessage({ tasks, config })
  return endMessage
}

const getEndMessage = function({ tasks, config }) {
  const tasksList = printTasksList({ tasks, config })
  const summaryString = printSummary({ tasks })

  return `${LINE}
${tasksList}${indent(summaryString)}
${LINE}
`
}

module.exports = {
  end,
}
