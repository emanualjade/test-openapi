'use strict'

const { STATUS_CODES } = require('statuses')
const { groupBy } = require('lodash')

// All possible HTTP status code as an array and as a
// `{ "1xx": [...], "2xx": [...], ... }` map
const getValidStatusesMap = function() {
  const validStatuses = Object.keys(STATUS_CODES)
  const validStatusesMap = groupBy(validStatuses, status => `${status[0]}xx`)
  return { validStatuses, validStatusesMap }
}

const {
  validStatuses: VALID_STATUSES,
  validStatusesMap: VALID_STATUSES_MAP,
} = getValidStatusesMap()

module.exports = {
  VALID_STATUSES,
  VALID_STATUSES_MAP,
}
