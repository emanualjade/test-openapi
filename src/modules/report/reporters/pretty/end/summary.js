'use strict'

const { getSummary, yellow } = require('../../../utils')
const { NAMES } = require('../constants')

// Print final reporting message with counter of passed|failed|skipped tasks
const printSummary = function({ tasks }) {
  const { skip, pass, fail } = getSummary({ tasks })
  // Order matters
  const summary = { skip, pass, fail }

  // Pad numbers to the right
  const padLength = String(summary.total).length

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

module.exports = {
  printSummary,
}
