'use strict'

const memoize = require('fast-memoize')
const { get } = require('lodash')

const { validator } = require('./validator')

// Validate a value against a JSON schema
const validateFromSchema = function({ schema, value, name }) {
  const passed = validator.validate(schema, value)

  if (passed) {
    return {}
  }

  const error = getError({ validator, schema, value, name })
  return error
}

const getError = function({
  validator: {
    errors: [error],
  },
  schema,
  value,
  name,
}) {
  const message = getErrorMessage({ error, name })
  const path = getErrorPath({ error })
  const valueA = getErrorValue({ path, value })
  const schemaPath = getErrorSchemaPath({ error })
  const schemaA = getErrorSchema({ schemaPath, schema })

  return { error: message, path, value: valueA, schemaPath, schema: schemaA }
}

const getErrorMessage = function({ error, name = '' }) {
  return validator.errorsText([error], { dataVar: name })
}

const getErrorPath = function({ error: { dataPath } }) {
  return dataPath.replace(INDEX_BRACKETS_REGEXP, '.$1').replace(/^\./, '')
}

// Array index: `[integer]`
const INDEX_BRACKETS_REGEXP = /\[([\d]+)\]/g

const getErrorValue = function({ path, value }) {
  if (path === '') {
    return value
  }

  return get(value, path)
}

const getErrorSchemaPath = function({ error: { schemaPath } }) {
  return schemaPath.replace('#/', '').split('/')
}

const getErrorSchema = function({ schemaPath, schema }) {
  const key = schemaPath[schemaPath.length - 1]
  const value = get(schema, schemaPath)
  return { [key]: value }
}

// Compilation is automatically memoized by `ajv` but not validation
const mValidateFromSchema = memoize(validateFromSchema)

module.exports = {
  validateFromSchema: mValidateFromSchema,
}
