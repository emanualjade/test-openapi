'use strict'

// Retrieve test's expected response HTTP status code
const getResponseStatus = function({
  testOpts: { response: { status: schema = DEFAULT_SCHEMA } = {} },
}) {
  return { ...schema, type: 'integer' }
}

const DEFAULT_SCHEMA = { enum: [200] }

module.exports = {
  getResponseStatus,
}
