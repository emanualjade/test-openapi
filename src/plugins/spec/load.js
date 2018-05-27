'use strict'

const SwaggerParser = require('swagger-parser')

const { addErrorHandler, throwSpecificationError } = require('../../errors')

// Parses an OpenAPI file (including JSON references)
// Can also be a URL or directly an object
// Also validates its syntax
const loadOpenApiSpec = function({ spec }) {
  return SwaggerParser.validate(spec)
}

const loadSpecHandler = function({ message, details }) {
  if (!Array.isArray(details)) {
    fetchSpecHandler({ message })
  }

  invalidSpecHandler({ details })
}

// Validate OpenAPI file exists and can be fetched
const fetchSpecHandler = function({ message }) {
  throwSpecificationError(`OpenAPI specification could not be loaded: ${message}`)
}

// Validate OpenAPI specification syntax
const invalidSpecHandler = function({ details, details: [{ path }] }) {
  const message = details.map(getErrorMessage).join(`\n${INDENT}`)
  const property = path.join('.')
  throwSpecificationError(`OpenAPI specification is invalid:\n${INDENT}${message}`, { property })
}

const INDENT_LENGTH = 4
const INDENT = ' '.repeat(INDENT_LENGTH)

const getErrorMessage = function({ path, message }) {
  return `At '${path.join('.')}': ${message}`
}

const eLoadOpenApiSpec = addErrorHandler(loadOpenApiSpec, loadSpecHandler)

module.exports = {
  loadOpenApiSpec: eLoadOpenApiSpec,
}
