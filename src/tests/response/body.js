'use strict'

const { merge } = require('lodash')

const { normalizeSchema } = require('../json_schema')

// Retrieve test's expected response body
const getSpecResBody = function({
  schema,
  settings: { response: settingsResponse = {}, response: { schema: settingsSchema } = {} },
}) {
  // Using an `undefined|null` schema means body should be empty
  // I.e. for `x-tests`, `{ response: { schema: undefined } }` is different from `{ response: {} }`
  if (settingsResponse.propertyIsEnumerable('schema') && settingsSchema == null) {
    return
  }

  if (schema == null) {
    return
  }

  const schemaA = merge({}, schema, settingsSchema)

  const schemaB = normalizeSchema({ schema: schemaA })

  return schemaB
}

module.exports = {
  getSpecResBody,
}
