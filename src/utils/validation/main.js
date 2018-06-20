'use strict'

const memoize = require('fast-memoize')

const { validator } = require('./validator')

// Validate a value against a JSON schema
const validateFromSchema = function({ schema, value, name }) {
  const passed = validator.validate(schema, value)

  if (passed) {
    return {}
  }

  const {
    errors: [error],
  } = validator
  const { dataPath } = error
  const errorA = getError({ error, name })

  const path = dataPath.replace(/^./, '')

  return { error: errorA, path }
}

// Human-friendly error
const getError = function({ error, name = '' }) {
  return validator.errorsText([error], { dataVar: name })
}

// Compilation is automatically memoized by `ajv` but not validation
const mValidateFromSchema = memoize(validateFromSchema)

module.exports = {
  validateFromSchema: mValidateFromSchema,
}
