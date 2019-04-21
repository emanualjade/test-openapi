import JSON_SCHEMA_SCHEMA from 'ajv/lib/refs/json-schema-draft-04.json'
import { omit } from 'lodash'

import { checkSchema } from './check.js'

// Like `checkSchema()` but validating that the value is a JSON schema v4
export const checkIsSchema = function(opts) {
  const message = getSchemaMessage(opts)

  checkSchema({ schema: jsonSchemaSchema, message, ...opts })
}

const getSchemaMessage = function({ valueProp }) {
  const name = valueProp === undefined ? 'schema' : `'${valueProp}'`
  return `${name} is not a valid JSON schema version 4`
}

const getJsonSchemaSchema = function() {
  return SCHEMA_FIXES.reduce((schema, fix) => fix(schema), JSON_SCHEMA_SCHEMA)
}

const removeId = function(schema) {
  return omit(schema, ['id', '$schema'])
}

// `exclusiveMinimum` boolean is not valid in the JSON schema version
// used by `ajv`
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
  return {
    ...schema,
    patternProperties: { '^x-*': {} },
    additionalProperties: false,
  }
}

const SCHEMA_FIXES = [removeId, fixMultipleOf, fixFormat, fixCustomProperties]

const jsonSchemaSchema = getJsonSchemaSchema()
