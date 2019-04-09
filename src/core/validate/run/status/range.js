import { difference, uniq } from 'lodash'

import { VALID_STATUSES_MAP } from './valid.js'

// `validate.status` can be `1xx`, `2xx`, `3xx`, `4xx` or `5xx`,
// case-insensitively
export const parseRanges = function({ statuses }) {
  const statusesA = statuses.flatMap(parseRange)
  const statusesB = uniq(statusesA)
  return statusesB
}

const parseRange = function(status) {
  if (!RANGE_REGEXP.test(status)) {
    return status
  }

  const statuses = VALID_STATUSES_MAP[status.toLowerCase()]
  return statuses
}

const RANGE_REGEXP = /^[1-5]xx$/iu

// Replace `100` + `101` + `102` by `1xx`, for any status code range
export const replaceByRanges = function({ statuses }) {
  return Object.entries(VALID_STATUSES_MAP).reduce(replaceByRange, statuses)
}

const replaceByRange = function(statuses, [range, rangeStatuses]) {
  const statusesA = difference(statuses, rangeStatuses)

  // Only if all possible status codes for that range are here
  if (statuses.length - statusesA.length !== rangeStatuses.length) {
    return statuses
  }

  return [range, ...statusesA]
}
