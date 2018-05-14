'use strict'

const { mergeTestSchema } = require('../common')

// Merge `test.response.body` to specification
const mergeResponseBody = function({
  operation: {
    response: { body: specSchema },
  },
  testOpts: { response: { body: testSchema } = {} },
}) {
  if (testSchema === undefined) {
    return specSchema
  }

  const schema = mergeTestSchema({ specSchema, testSchema })
  return schema
}

module.exports = {
  mergeResponseBody,
}
