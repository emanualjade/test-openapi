'use strict'

const openapiToJsonSchema = require('openapi-schema-to-json-schema')
const { omit } = require('lodash')

const { crawl } = require('../../../../utils')

// OpenAPI schemas are not 100% valid JSON schemas v4, so we use a library to convert them
const normalizeSchema = function({ schema }) {
  const schemaA = normalizeKeys({ schema })

  // At the moment, this function should not throw because we already validated `schema`
  const schemaB = openapiToJsonSchema(schemaA)

  // `ajv` complains about it
  const schemaC = omit(schemaB, '$schema')

  return schemaC
}

const normalizeKeys = function({ schema }) {
  return crawl(schema, undefined, { evalKey: normalizeKey })
}

const normalizeKey = function(key) {
  if (KEYS[key] !== undefined) {
    return KEYS[key]
  }

  return key
}

const KEYS = {
  // OpenAPI 3 `nullable` does not exist in OpenAPI 2, but it's very useful as
  // it is converted to `type: ['null', ...]` by `openapi-schema-to-json-schema`.
  // We allow it under OpenAPI 2 using `x-nullable` which is used by other libraries
  // like Redoc.
  'x-nullable': 'nullable',
  // OpenAPI 3 `oneOf` does not exist in OpenAPI 2, but it's very useful because
  // it allows alternatives of `type`,
  // We allow it under OpenAPI 2 using `x-oneOf`.
  'x-oneOf': 'oneOf',
}

module.exports = {
  normalizeSchema,
}
