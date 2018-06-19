'use strict'

const jsonSchemaFaker = require('json-schema-faker')
const { mapValues } = require('lodash')
const { mergeAll } = require('lodash/fp')
const formatRegExps = require('ajv/lib/compile/formats')

const { TestOpenApiError } = require('../../errors')
const { validateIsSchema, stringifyFlat } = require('../../utils')

// Generates random values based on `task.random.*` JSON schemas
const run = function({ random, call }) {
  if (random === undefined) {
    return
  }

  const randomParams = mapValues(random, generateParam)

  // `task.random.*` have less priority than `task.call.*`
  const callA = mergeAll([randomParams, call])

  return { call: callA }
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

// Specifies `json-schema-faker` options
const addFakerOptions = function() {
  jsonSchemaFaker.option({
    // JSON format v4 allow custom formats
    failOnInvalidFormat: false,
    // All deep properties always generated
    optionalsProbability: 1,
  })

  addCustomFormats()
}

// Allow `json-schema-faker` to use all the `format` that `ajv` can handle,
// except `regexp`. Note that AJV does not support JSON schema v7 formats
// `idn-email|hostname` nor `iri[-reference]`
const addCustomFormats = function() {
  Object.entries(CUSTOM_FORMATS).forEach(addCustomFormat)
}

const addCustomFormat = function([name, regexp]) {
  jsonSchemaFaker.format(name, () => jsonSchemaFaker.random.randexp(regexp))
}

// UUID any version
const UUID_REGEXP = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/

const CUSTOM_FORMATS = {
  // JSON schema v6
  'uri-template': formatRegExps.full['uri-template'],
  'json-pointer': formatRegExps.full['json-pointer'],

  // JSON schema v7
  date: formatRegExps.fast.date,
  time: formatRegExps.fast.time,
  'relative-json-pointer': formatRegExps.full['relative-json-pointer'],

  // Custom AJV format
  url: formatRegExps.full.url,
  'json-pointer-uri-fragment': formatRegExps.full['json-pointer-uri-fragment'],
  uuid: UUID_REGEXP,
}

addFakerOptions()

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
  run,
}
