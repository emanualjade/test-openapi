'use strict'

const memoize = require('fast-memoize')
const { get } = require('lodash')

const { validator } = require('./validator')

// Validate a value against a JSON schema
const validateFromSchema = function({ schema, value, name, target }) {
  const passed = validator.validate(schema, value)

  if (passed) {
    return {}
  }

  const error = getError({ validator, schema, value, name, target })
  return error
}

const getError = function({
  validator: {
    errors: [error],
  },
  schema,
  value,
  name,
  target,
}) {
  const message = getErrorMessage({ error })
  const path = getErrorPath({ error })
  const valueA = getErrorValue({ path, value })
  const schemaPath = getErrorSchemaPath({ error })
  const schemaA = getErrorSchema({ schemaPath, schema })
  const property = getErrorProperty({ name, path, schemaPath, target })

  return { error: message, path, value: valueA, schemaPath, schema: schemaA, property }
}

const getErrorMessage = function({ error }) {
  return validator.errorsText([error], { dataVar: '' }).replace(/^\./, '')
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

// `target` is whether `error.property` shouls target the schema path or the value path
const getErrorProperty = function({ name, path, schemaPath, target = 'value' }) {
  if (target === 'value') {
    return getErrorPropertyValue({ name, path })
  }

  return getErrorPropertySchema({ name, schemaPath })
}

const getErrorPropertyValue = function({ name, path }) {
  if (name === undefined) {
    return path
  }

  if (path === '') {
    return name
  }

  return `${name}.${path}`
}

const getErrorPropertySchema = function({ name, schemaPath }) {
  if (name === undefined) {
    return schemaPath
  }

  return [name, ...schemaPath].join('.')
}

// Compilation is automatically memoized by `ajv` but not validation
const mValidateFromSchema = memoize(validateFromSchema)

module.exports = {
  validateFromSchema: mValidateFromSchema,
}
