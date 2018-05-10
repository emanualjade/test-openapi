'use strict'

const { merge } = require('lodash')

const { normalizeSchema } = require('../json_schema')

// Retrieve test's expected response body
const getSpecResBody = function({
  schema: body,
  testOpts: { response = {}, response: { body: testBody } = {} },
}) {
  // Using an `undefined|null` schema means body should be empty
  // I.e. for `testOpts.response`, `{ body: undefined }` is different from `{}`
  if (response.propertyIsEnumerable('body') && testBody == null) {
    return
  }

  if (body == null) {
    return
  }

  const schema = merge({}, body, testBody)

  const specResBody = normalizeSchema({ schema })
  return specResBody
}

module.exports = {
  getSpecResBody,
}
