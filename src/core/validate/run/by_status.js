'use strict'

const { pickBy, omitBy } = require('lodash')

const { merge, getPath } = require('../../../utils')

const { STATUS_REGEXP, parseStatus } = require('./status')

// `validate.STATUS.*` is like `validate.*` but as map according to status code.
// STATUS can use ranges and comma-separated lists like `validate.status`
const addByStatus = function({ validate, response }) {
  const byStatus = pickBy(validate, isByStatus)
  const validateA = omitBy(validate, isByStatus)

  const byStatusA = Object.entries(byStatus)
    .filter(([status]) => matchesResponse({ status, response }))
    .map(([, value]) => value)

  if (byStatusA.length === 0) {
    return validateA
  }

  // `validate.STATUS` has lower priority because of its use in `spec` plugin
  return merge(...byStatusA, validateA)
}

const isByStatus = function(value, name) {
  return STATUS_REGEXP.test(name)
}

const matchesResponse = function({ status, response }) {
  if (!STATUS_REGEXP.test(status)) {
    return false
  }

  const property = getPath(['task', 'validate', status])
  const statuses = parseStatus({ status, property })

  const matchesStatus = statuses.includes(String(response.status))
  return matchesStatus
}

module.exports = {
  addByStatus,
}
