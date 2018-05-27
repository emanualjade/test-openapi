'use strict'

const { merge } = require('lodash')

const { mergeParams, mergeHeaders } = require('../../utils')

const { mergeInvalidSchema, isInvalidSchema } = require('./invalid')

// Merge tasks to specification
const mergeTask = function({ params, validate: { status, headers, body }, operation }) {
  // Merge `task.parameters.*` to specification
  const paramsA = mergeParams([...operation.params, ...params], mergeSpec)
  // Merge `task.validate.headers.*` to specification
  const headersA = mergeHeaders([...operation.response.headers, ...headers], mergeSpec)
  // Merge `task.validate.body` to specification
  const bodyA = mergeSpecSchema(operation.response.body, body)

  const validate = { status, headers: headersA, body: bodyA }
  return { params: paramsA, validate }
}

// Merge a `task.*.*` value with the specification value
const mergeSpec = function({ schema: specSchema, ...specValue }, { schema, ...value }) {
  const schemaA = mergeSpecSchema(specSchema, schema)
  return { ...specValue, ...value, schema: schemaA }
}

// Deep merge the JSON schemas
// Both `specSchema` and `schema` might be `undefined`
const mergeSpecSchema = function(specSchema, schema) {
  if (isInvalidSchema({ schema })) {
    return mergeInvalidSchema({ specSchema })
  }

  return merge({}, specSchema, schema)
}

module.exports = {
  mergeTask,
}
