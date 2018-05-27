'use strict'

const { merge } = require('lodash')

const { mergeParams, mergeHeaders } = require('../../../utils')

const { getSpecOperation, getSpecResponse } = require('./operation')
const { mergeInvalidSchema, isInvalidSchema } = require('./invalid')

// Merge `task.parameters.*` to specification
const mergeSpecParams = function({ taskKey, config, params }) {
  const specOperation = getSpecOperation({ taskKey, config })
  if (specOperation === undefined) {
    return
  }

  const paramsA = mergeParams([...specOperation.params, ...params], mergeSpec)
  return { params: paramsA }
}

// Merge `task.validate.*` to specification
const mergeSpecValidate = function({
  taskKey,
  config,
  validate: { status, headers, body },
  rawResponse,
}) {
  const specResponse = getSpecResponse({ taskKey, config, rawResponse })
  if (specResponse === undefined) {
    return
  }

  const headersA = mergeHeaders([...specResponse.headers, ...headers], mergeSpec)
  const bodyA = mergeSpecSchema(specResponse.body, body)

  return { validate: { status, headers: headersA, body: bodyA } }
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
  mergeSpecParams,
  mergeSpecValidate,
}
