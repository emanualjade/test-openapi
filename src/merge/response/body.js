'use strict'

const { mergeInput } = require('../common')

// Merge `test.response.body` to specification
const mergeResponseBody = function({
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
  mergeResponseBody,
}
