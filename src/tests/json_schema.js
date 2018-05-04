'use strict'

const openapiToJsonSchema = require('openapi-schema-to-json-schema')

// From OpenAPI `parameters` schema to JSON schema
const normalizeSchemas = function({ specReqParams }) {
  return specReqParams.map(params => params.map(normalizeEachSchemas))
}

const normalizeEachSchemas = function({ schema, ...specReqParam }) {
  const schemaA = normalizeSchema({ schema })

  return { schema: schemaA, ...specReqParam }
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
