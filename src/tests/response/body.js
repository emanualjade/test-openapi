'use strict'

const { mergeInput } = require('../../utils')

// Retrieve test's expected response body
const getResponseBody = function({
  operation: {
    response: { body: schema },
  },
  testOpts: { response: { body: testSchema } = {} },
}) {
  if (testSchema === undefined) {
    return schema
  }

  const { schema: schemaA } = mergeInput({ schema }, { schema: testSchema })
  return schemaA
}

module.exports = {
  getResponseBody,
}
