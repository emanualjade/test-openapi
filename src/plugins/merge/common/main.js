'use strict'

const { merge } = require('lodash')

const { isObject } = require('../../../utils')

const { mergeInvalidSchema } = require('./invalid')
const { mergeShortcutSchema } = require('./shortcut')

// Deep merge a `task.*.*` value with the specification value
const mergeSpec = function({ schema: specSchema, ...specValue }, { schema, ...value }) {
  const schemaA = mergeSpecSchema(specSchema, schema)
  return { ...specValue, ...value, schema: schemaA }
}

const mergeSpecSchema = function(specSchema, schema) {
  if (schema === 'invalid') {
    return mergeInvalidSchema({ specSchema, schema })
  }

  if (!isObject(schema)) {
    return mergeShortcutSchema({ specSchema, schema })
  }

  // Otherwise it is a JSON schema that we deep merge
  return merge({}, specSchema, schema)
}

module.exports = {
  mergeSpec,
  mergeSpecSchema,
}
