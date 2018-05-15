'use strict'

const JSON_SCHEMA_SCHEMA = require('ajv/lib/refs/json-schema-draft-04')
const { omit } = require('lodash')

const { throwTestError } = require('../errors')
const { validateFromSchema, isObject } = require('../utils')

// Validate that test values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
const validateJsonSchemas = function({ testName, test }) {
  Object.entries(test).forEach(([topName, requestResponse]) =>
    validateRequestResponse({ testName, topName, requestResponse }),
  )
}

const validateRequestResponse = function({ testName, topName, requestResponse }) {
  Object.entries(requestResponse).forEach(([attrName, jsonSchema]) =>
    validateJsonSchema({ testName, topName, attrName, jsonSchema }),
  )
}

const validateJsonSchema = function({ testName, topName, attrName, jsonSchema }) {
  // `test.response.status` is an integer not a JSON schema
  // Also shortcut notation can be used
  if (attrName === 'status' || !isObject(jsonSchema)) {
    return
  }

  const { error } = validateFromSchema({
    schema: JSON_SCHEMA_SCHEMA_V4,
    value: jsonSchema,
    name: '',
  })
  if (error === undefined) {
    return
  }

  const path = `${testName}.${topName}.${attrName}`

  throwTestError(`'${path}' is not a valid JSON schema v4:${error}`, {
    test: testName,
    property: path,
  })
}

const getJsonSchemaSchema = function() {
  const schema = omit(JSON_SCHEMA_SCHEMA, ['id', '$schema'])

  // `exclusiveMinimum` boolean is not valid in the JSON schema version used by `ajv`
  const multipleOf = { type: 'number', exclusiveMinimum: 0 }

  return {
    ...schema,
    properties: { ...schema.properties, multipleOf },
    additionalProperties: false,
  }
}

const JSON_SCHEMA_SCHEMA_V4 = getJsonSchemaSchema()

module.exports = {
  validateJsonSchemas,
}
