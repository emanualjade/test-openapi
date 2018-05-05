'use strict'

const { merge } = require('lodash')

const { normalizeSchema } = require('../json_schema')

// Retrieve test's expected response body
const getSpecResBody = function({ schema, settings, settings: { response } }) {
  // Using an `undefined|null` schema means body should be empty
  // I.e. for `x-tests`, `{ response: undefined }` is different from `{}`
  if (settings.propertyIsEnumerable('response') && response == null) {
    return
  }

  if (schema == null) {
    return
  }

  const schemaA = merge({}, schema, response)

  const schemaB = normalizeSchema({ schema: schemaA })

  return schemaB
}

module.exports = {
  getSpecResBody,
}
