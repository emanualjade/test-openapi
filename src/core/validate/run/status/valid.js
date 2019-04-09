import { STATUS_CODES } from 'statuses'
import { groupBy } from 'lodash'

// All possible HTTP status code as an array and as a
// `{ "1xx": [...], "2xx": [...], ... }` map
const getValidStatusesMap = function() {
  const validStatuses = Object.keys(STATUS_CODES)
  const validStatusesMap = groupBy(validStatuses, status => `${status[0]}xx`)
  return { validStatuses, validStatusesMap }
}

import {
  validStatuses: VALID_STATUSES,
  validStatusesMap: VALID_STATUSES_MAP,
} = getValidStatusesMap()

module.exports = {
  VALID_STATUSES,
  VALID_STATUSES_MAP,
}
