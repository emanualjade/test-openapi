'use strict'

const jsonSchemaFaker = require('json-schema-faker')

const { isSkippedOptional, fixRequired, addOptionalsProbability } = require('./optional')

// Generates random values based on `task.random.*` JSON schemas
const generateParams = function({ call: { params, ...call } }) {
  const paramsA = params
    .map(param => generateParam({ param, params }))
    .filter(param => param !== undefined)
  return { call: { ...call, params: paramsA } }
}

// Generate value based on a single JSON schema
const generateParam = function({ param, param: { random }, params }) {
  if (random === undefined) {
    return param
  }

  if (isSkippedOptional({ param, params })) {
    return
  }

  const paramA = fixRequired({ param, params })

  addOptionalsProbability({ param: paramA })

  const { value: schema } = paramA
  const schemaA = fixArray({ schema })

  const value = jsonSchemaFaker(schemaA)
  return { ...paramA, value }
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

module.exports = {
  generateParams,
}
