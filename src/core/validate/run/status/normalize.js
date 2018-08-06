'use strict'

const { getWordsList, sortArray } = require('../../../../utils')

const { replaceByRanges } = require('./range')

// Normalize status for error reporting
const normalizeStatuses = function(statuses) {
  const statusesA = replaceByRanges({ statuses })

  const statusesB = sortArray(statusesA)

  const statusesC = statusesB.map(numerizeStatus)

  if (statusesC.length === 1) {
    return { value: statusesC[0], statusesStr: String(statusesC[0]) }
  }

  const statusesStr = getWordsList(statusesC)
  return { value: statusesC, statusesStr }
}

// Try to error report statuses as integers
const numerizeStatus = function(status) {
  const statusA = Number(status)

  if (!Number.isInteger(statusA)) {
    return status
  }

  return statusA
}

module.exports = {
  normalizeStatuses,
}
