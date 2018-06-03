'use strict'

const jsonSchemaFaker = require('json-schema-faker')

// Generates random values based on `task.random.*` JSON schemas
const generateParams = function({ call: { params, ...call } }) {
  const paramsA = params.map(param => generateParam({ param })).filter(shouldIncludeParam)
  return { call: { ...call, params: paramsA } }
}

// Generate value based on a single JSON schema
const generateParam = function({ param, param: { isRandom, required, value: schema } }) {
  if (!isRandom) {
    return param
  }

  // Optional parameters are never generated
  if (!required) {
    return { ...param, value: undefined }
  }

  const schemaA = fixArray({ schema })
  const value = jsonSchemaFaker(schemaA)
  return { ...param, value }
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
})

// Optional request parameters that have not been picked
const shouldIncludeParam = function({ value }) {
  return value !== undefined
}

module.exports = {
  generateParams,
}
