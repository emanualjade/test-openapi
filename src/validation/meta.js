'use strict'

const JSON_SCHEMA_SCHEMA = require('ajv/lib/refs/json-schema-draft-04')
const { omit } = require('lodash')

const { checkSchema } = require('./check')
const { CUSTOM_KEYWORDS } = require('./validator')

const checkIsSchema = function({ name, message = name || 'schema', ...opts }) {
  const messageA = `${message} is not a valid JSON schema version 4. It`

  checkSchema({ schema: jsonSchemaSchema, name, message: messageA, ...opts })
}

const getJsonSchemaSchema = function() {
  return SCHEMA_FIXES.reduce((schema, fix) => fix(schema), JSON_SCHEMA_SCHEMA)
}

const removeId = function(schema) {
  return omit(schema, ['id', '$schema'])
}

// `exclusiveMinimum` boolean is not valid in the JSON schema version used by `ajv`
const fixMultipleOf = function(schema) {
  const multipleOf = { type: 'number', exclusiveMinimum: 0 }

  return {
    ...schema,
    properties: { ...schema.properties, multipleOf },
  }
}

// `format` is not present in JSON schema v4 meta-schema but is actually allowed
const fixFormat = function(schema) {
  const format = { type: 'string' }
  return { ...schema, properties: { ...schema.properties, format } }
}

// `x-*` custom properties are not present in JSON schema v4 meta-schema but are
// actually allowed
const fixCustomProperties = function(schema) {
  return { ...schema, patternProperties: { '^x-*': {} }, additionalProperties: false }
}

// Allow `ajv-keywords` properties
const addCustomKeywords = function(schema) {
  const keywords = CUSTOM_KEYWORDS.map(name => ({ [name]: {} }))
  const keywordsA = Object.assign({}, ...keywords)

  return { ...schema, properties: { ...schema.properties, ...keywordsA } }
}

const SCHEMA_FIXES = [removeId, fixMultipleOf, fixFormat, fixCustomProperties, addCustomKeywords]

const jsonSchemaSchema = getJsonSchemaSchema()

module.exports = {
  checkIsSchema,
}
