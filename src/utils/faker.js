'use strict'

const jsonSchemaFaker = require('json-schema-faker')

// Generate random values from a JSON schema
const generateFromSchema = function({ schema }) {
  return jsonSchemaFaker(schema)
}

const JSON_SCHEMA_FAKER_OPTS = {
  optionalsProbability: 0.3,
}

jsonSchemaFaker.option(JSON_SCHEMA_FAKER_OPTS)

module.exports = { generateFromSchema }
