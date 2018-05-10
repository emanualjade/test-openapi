'use strict'

const openapiToJsonSchema = require('openapi-schema-to-json-schema')

// From OpenAPI `parameters` schema to JSON schema
const normalizeSchemas = function({ requests }) {
  return requests.map(request => request.map(normalizeEachSchemas))
}

const normalizeEachSchemas = function({ schema, ...request }) {
  const schemaA = normalizeSchema({ schema })

  return { schema: schemaA, ...request }
}

// OpenAPI schemas are not 100% valid JSON schemas v4, so we use a library to convert them
const normalizeSchema = function({ schema }) {
  const schemaA = openapiToJsonSchema(schema)

  // `ajv` complains about it
  delete schemaA.$schema

  return schemaA
}

module.exports = {
  normalizeSchemas,
  normalizeSchema,
}
