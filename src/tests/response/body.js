'use strict'

const { normalizeSchema } = require('../json_schema')
const { mergeInput } = require('../merge')

// Retrieve test's expected response body
const getResponseBody = function({ schema, testOpts: { response: { body: testSchema } = {} } }) {
  const schemaA = normalizeSchema({ schema })

  if (testSchema === undefined) {
    return schemaA
  }

  const { schema: schemaB } = mergeInput({ schema: schemaA }, { schema: testSchema })
  return schemaB
}

module.exports = {
  getResponseBody,
}
