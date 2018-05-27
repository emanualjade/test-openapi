'use strict'

const { merge } = require('lodash')

const { mergeInvalidSchema, isInvalidSchema } = require('./invalid')

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
  mergeSpec,
  mergeSpecSchema,
}
