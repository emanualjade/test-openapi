'use strict'

const { DEFAULT_STATUS_CODE } = require('../../constants')

// Retrieve test's expected response HTTP status code
const getResponseStatus = function({
  testOpts: { response: { status: schema = DEFAULT_SCHEMA } = {} },
}) {
  return { ...schema, type: 'integer' }
}

const DEFAULT_SCHEMA = { enum: [DEFAULT_STATUS_CODE] }

module.exports = {
  getResponseStatus,
}
