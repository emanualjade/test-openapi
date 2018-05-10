'use strict'

const jsonSchemaFaker = require('json-schema-faker')

// Generate random values from a JSON schema
const generateFromSchema = function({ schema }) {
  return jsonSchemaFaker(schema)
}

module.exports = { generateFromSchema }
