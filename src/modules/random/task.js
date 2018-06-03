'use strict'

const jsonSchemaFaker = require('json-schema-faker')

// Generates random values based on `task.random.*` JSON schemas
const generateParams = function({ call: { params, ...call } }) {
  const paramsA = params.map(param => generateParam({ param }))
  return { call: { ...call, params: paramsA } }
}

// Generate value based on a single JSON schema
const generateParam = function({ param, param: { isRandom, required, value: schema } }) {
  if (!isRandom) {
    return param
  }

  const schemaA = fixArray({ schema })

  addRequired({ required })

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

// When `required` is `full`, all deep properties are generated regardless of
// JSON schema's `required`. E.g. `task.call|random.*` are always deeply
// generated because they are explicited by the user.
// When `required` is `partial` or `optional`, JSON schema's `required` is
// used to determine whether deep properties should be geneated.
// E.g. `spec` parameters use this.
const addRequired = function({ required }) {
  const optionalsProbability = required === 'full' ? 1 : 0
  jsonSchemaFaker.option({ optionalsProbability })
}

jsonSchemaFaker.option({
  // JSON format v4 allow custom formats
  failOnInvalidFormat: false,
})

module.exports = {
  generateParams,
}
