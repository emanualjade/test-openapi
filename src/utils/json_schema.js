'use strict'

const Ajv = require('ajv')

const { memoize } = require('./memoize')

// Validate a value against a JSON schema
const validateFromSchema = function({ schema, value, name }) {
  const passed = validator.validate(schema, value)

  if (passed) {
    return {}
  }

  const {
    errors: [error],
  } = validator
  const errorA = getError({ error, name })
  const { dataPath: path } = error

  return { error: errorA, path }
}

// Human-friendly error
const getError = function({ error, name }) {
  return validator.errorsText([error], { dataVar: name })
}

const getValidator = function() {
  return new Ajv(AJV_OPTS)
}

const AJV_OPTS = {
  // AJV error messages can look overwhelming, so let's keep only the first one
  allErrors: false,
  format: 'full',
}

const validator = getValidator()

// Compilation is automatically memoized by `ajv` but not validation
const mValidateFromSchema = memoize(validateFromSchema)

module.exports = {
  validateFromSchema: mValidateFromSchema,
}
