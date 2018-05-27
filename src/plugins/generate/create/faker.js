'use strict'

const jsonSchemaFaker = require('json-schema-faker')

// Generate random values from a JSON schema
const generateFromSchema = function({ schema }) {
  return jsonSchemaFaker(schema)
}

jsonSchemaFaker.option({
  // JSON format v4 allow custom formats
  failOnInvalidFormat: false,
})

module.exports = { generateFromSchema }
