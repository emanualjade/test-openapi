'use strict'

const jsonSchemaFaker = require('json-schema-faker')

const { isSameParam } = require('../../utils')

// Generates random values based on `task.random.*` JSON schemas
const generateParams = function({ call: { params, ...call } }) {
  const paramsA = params
    .map(param => generateParam({ param, params }))
    .filter(param => param !== undefined)
  return { call: { ...call, params: paramsA } }
}

// Generate value based on a single JSON schema
const generateParam = function({ param, param: { random, value: schema }, params }) {
  if (random === undefined) {
    return param
  }

  if (isSkippedOptional({ param, params })) {
    return
  }

  const schemaA = fixArray({ schema })

  addOptionalsProbability({ random })

  const value = jsonSchemaFaker(schemaA)
  return { ...param, value }
}

// `params` with `random: optional` are only kept when merged with another
// parameter. E.g. OpenAPI parameters that are `required: false` will only be
// used if merged into some other `task.call|random.*` parameter.
// This also means using an empty object in `task.call|random.*` allows re-using
// spec parameters.
const isSkippedOptional = function({ param, param: { random }, params }) {
  return random === 'optional' && isNotMerged({ param, params })
}

const isNotMerged = function({ param, params }) {
  return !params.some(paramB => willBeMerged(param, paramB))
}

const willBeMerged = function(paramA, paramB) {
  return paramA !== paramB && isSameParam(paramA, paramB)
}

// json-schema-faker does not work properly with array schema that do not have
// an `items.type` property
const fixArray = function({ schema, schema: { type, items = {} } }) {
  if (type !== 'array' || items.type !== undefined) {
    return schema
  }

  return { ...schema, items: { ...items, type: 'string' } }
}

// When `random` is `deep`, all deep properties are generated regardless of `required`.
// E.g. `task.call|random.*` are always deeply generated because they are
// explicited by the user.
// When `random` is `shallow` or `optional`, `required` is used to determine
// whether deep properties should be geneated.
// E.g. `spec` parameters use this.
const addOptionalsProbability = function({ random }) {
  const optionalsProbability = PROBABILITY[random]
  jsonSchemaFaker.option({ optionalsProbability })
}

const PROBABILITY = {
  deep: 1,
  shallow: 0,
  optional: 0,
}

jsonSchemaFaker.option({
  // JSON format v4 allow custom formats
  failOnInvalidFormat: false,
})

module.exports = {
  generateParams,
}
