import openapiToJsonSchema from 'openapi-schema-to-json-schema'
import { omit } from 'lodash'

import { crawl } from '../../../../utils/crawl.js'

// OpenAPI schemas are not 100% valid JSON schemas v4, so we use a library to
// convert them
export const normalizeSchema = function({ schema }) {
  const schemaA = normalizeKeys({ schema })

  // At the moment, this function should not throw because we already validated
  // `schema`
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
  // it is converted to `type: ['null', ...]` by
  // `openapi-schema-to-json-schema`.
  // We allow it under OpenAPI 2 using `x-nullable` which is used by other
  // libraries like Redoc.
  'x-nullable': 'nullable',
  // JSON schema v4 `oneOf|anyOf|not` does not exist in OpenAPI 2
  // JSON schema v4 `additionalItems|dependencies` does not exist in OpenAPI 2/3
  // We allow it using `x-oneOf|x-anyOf|x-not|x-additionalItems|dependencies`.
  'x-oneOf': 'oneOf',
  'x-anyOf': 'anyOf',
  'x-not': 'not',
  'x-additionalItems': 'additionalItems',
  'x-dependencies': 'dependencies',
}
