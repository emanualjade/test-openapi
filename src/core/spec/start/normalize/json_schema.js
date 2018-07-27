'use strict'

const openapiToJsonSchema = require('openapi-schema-to-json-schema')
const { omit } = require('lodash')

// OpenAPI schemas are not 100% valid JSON schemas v4, so we use a library to convert them
const normalizeSchema = function({ schema }) {
  // At the moment, this function should not throw because we already validated `schema`
  const schemaA = openapiToJsonSchema(schema)

  // `ajv` complains about it
  const schemaB = omit(schemaA, '$schema')

  return schemaB
}

module.exports = {
  normalizeSchema,
}
