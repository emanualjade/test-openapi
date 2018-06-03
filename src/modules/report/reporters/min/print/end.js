'use strict'

const { getSummary, yellow } = require('../../../utils')

// Print final reporting message with counter of passed|failed|skipped tasks
const getEndMessage = function({ tasks }) {
  const summary = getSummary({ tasks })
  const endMessage = printSummary({ summary })
  return `\n${endMessage}\n`
}

const printSummary = function({ summary, summary: { total } }) {
  // Pad numbers to the right
  const padLength = String(total).length

  return Object.entries(summary)
    .filter(shouldPrint)
    .map(([name, count]) => printEntry({ name, count, padLength }))
    .join('\n')
}

// Do not show `Skipped` if none skipped
const shouldPrint = function([name, count]) {
  return ['pass', 'fail'].includes(name) || (name === 'skip' && count !== 0)
}

const printEntry = function({ name, count, padLength }) {
  const nameA = NAMES[name]
  const countA = String(count).padStart(padLength)
  return `${yellow.bold(nameA)}${countA}`
}

const NAMES = {
  pass: 'Passed:  ',
  fail: 'Failed:  ',
  skip: 'Skipped: ',
}

module.exports = {
  getEndMessage,
}
