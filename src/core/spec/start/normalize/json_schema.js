'use strict'

const openapiToJsonSchema = require('openapi-schema-to-json-schema')
const { omit } = require('lodash')

const { crawl } = require('../../../../utils')

// OpenAPI schemas are not 100% valid JSON schemas v4, so we use a library to convert them
const normalizeSchema = function({ schema }) {
  const schemaA = crawl(schema, undefined, { evalKey: replaceNullable })

  // At the moment, this function should not throw because we already validated `schema`
  const schemaB = openapiToJsonSchema(schemaA)

  // `ajv` complains about it
  const schemaC = omit(schemaB, '$schema')

  return schemaC
}

// OpenAPI 3 `nullable` does not exist in OpenAPI 2, but it's very useful as
// it is converted to `type: ['null', ...]` by `openapi-schema-to-json-schema`.
// We allow it under OpenAPI 2 using `x-nullable` which is used by other libraries
// like Redoc.
const replaceNullable = function(key) {
  if (key !== 'x-nullable') {
    return key
  }

  return 'nullable'
}

module.exports = {
  normalizeSchema,
}
