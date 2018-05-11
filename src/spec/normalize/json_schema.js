'use strict'

const openapiToJsonSchema = require('openapi-schema-to-json-schema')

// OpenAPI schemas are not 100% valid JSON schemas v4, so we use a library to convert them
const normalizeSchema = function({ schema }) {
  const schemaA = openapiToJsonSchema(schema)

  // `ajv` complains about it
  delete schemaA.$schema

  return schemaA
}

module.exports = {
  normalizeSchema,
}
