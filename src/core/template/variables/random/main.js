import jsonSchemaFaker from 'json-schema-faker'

import { stringifyFlat } from '../../../../utils.js'
import { checkIsSchema } from '../../../../validation.js'

import { addCustomFormats } from './format.js'

// Generate random value based on a single JSON schema
const random = function(schema) {
  // Validate random parameters are valid JSON schema v4
  // We cannot use later versions because json-schema-faker does not support
  // them
  checkIsSchema({ value: schema })

  const schemaA = fixArray({ schema })

  const value = jsonSchemaFaker(schemaA)

  const valueA = addSeparators({ value, schema: schemaA })
  return valueA
}

// Json-schema-faker does not work properly with array schema that do not have
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

addFakerOptions()

// If `task.random.*.x-separator: string` defined, used it to concatenate an
// array into a string
// This is used to make OpenAPI `collectionFormat` work
const addSeparators = function({
  value,
  schema: { 'x-separator': separator },
}) {
  if (separator === undefined || !Array.isArray(value)) {
    return value
  }

  return value.map(stringifyFlat).join(separator)
}

module.exports = {
  $$random: random,
}
