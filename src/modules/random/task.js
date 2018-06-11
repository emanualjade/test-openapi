'use strict'

const jsonSchemaFaker = require('json-schema-faker')
const { mapValues } = require('lodash')

const { TestOpenApiError } = require('../../errors')
const { validateIsSchema, stringifyFlat } = require('../../utils')

// Generates random values based on `task.random.*` JSON schemas
const task = function({ random, call }) {
  const randomParams = mapValues(random, generateParam)
  // `task.random.*` have less priority than `task.call.*`
  return { call: { ...randomParams, ...call } }
}

// Generate value based on a single JSON schema
const generateParam = function(schema, key) {
  validateJsonSchema({ schema, key })

  const schemaA = fixArray({ schema })

  const value = jsonSchemaFaker(schemaA)

  const valueA = addSeparators({ value, schema: schemaA })

  return valueA
}

// Validate random parameters are valid JSON schema v4
// We cannot use later versions because json-schema-faker does not support them
const validateJsonSchema = function({ schema, key }) {
  const { error } = validateIsSchema({ value: schema })
  if (error === undefined) {
    return
  }

  const property = `random.${key}`
  throw new TestOpenApiError(`'${property}' is not a valid JSON schema v4:${error}`, {
    property,
  })
}

// json-schema-faker does not work properly with array schema that do not have
// an `items.type` property
const fixArray = function({ schema, schema: { type, items = {} } }) {
  if (type !== 'array' || items.type !== undefined) {
    return schema
  }

  return { ...schema, items: { ...items, type: 'string' } }
}

jsonSchemaFaker.option({
  // JSON format v4 allow custom formats
  failOnInvalidFormat: false,
  // All deep properties always generated
  optionalsProbability: 1,
})

// If `task.random.*.x-separator: string` defined, used it to concatenate an array
// into a string
// This is used to make OpenAPI `collectionFormat` work
const addSeparators = function({ value, schema: { 'x-separator': separator } }) {
  if (separator === undefined || !Array.isArray(value)) {
    return value
  }

  return value.map(stringifyFlat).join(separator)
}

module.exports = {
  task,
}
