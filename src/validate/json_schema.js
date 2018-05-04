'use strict'

const Ajv = require('ajv')

const { memoize } = require('../utils')

// Validate a value against a JSON schema
const validateFromSchema = function({ schema, value, name }) {
  const validate = compileJsonSchema(schema)
  const passed = validate(value)
  if (passed) {
    return false
  }

  const { errors } = validate
  const error = getErrorMessage({ errors, name })
  return error
}

// We compile separately to take advantage of compilation memoization
const compileJsonSchema = function(schema) {
  return ajv.compile(schema)
}

// Human-friendly error
const getErrorMessage = function({ errors, name }) {
  return ajv.errorsText(errors, { separator: '\n', dataVar: name })
}

const getJsonSchemaValidator = function() {
  return new Ajv(AJV_OPTS)
}

const AJV_OPTS = {
  // AJV error messages can look overwhelming, so let's keep only the first one
  allErrors: false,
  format: 'full',
}

const ajv = getJsonSchemaValidator()

// Compilation is automatically memoized by `ajv` but not validation
const mValidateFromSchema = memoize(validateFromSchema)

module.exports = {
  validateFromSchema: mValidateFromSchema,
}
