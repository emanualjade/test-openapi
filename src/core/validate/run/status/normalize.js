import { sortArray } from '../../../../utils/sort.js'
import { getWordsList } from '../../../../utils/string.js'

import { replaceByRanges } from './range.js'

// Normalize status for error reporting
export const normalizeStatuses = function(statuses) {
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
