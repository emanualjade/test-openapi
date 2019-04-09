import { STATUS_CODES } from 'statuses'
import { groupBy } from 'lodash'

// All possible HTTP status code as an array and as a
// `{ "1xx": [...], "2xx": [...], ... }` map
export const VALID_STATUSES = Object.keys(STATUS_CODES)

export const VALID_STATUSES_MAP = groupBy(
  VALID_STATUSES,
  status => `${status[0]}xx`,
)
