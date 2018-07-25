'use strict'

const memoize = require('fast-memoize')
const { get, omitBy } = require('lodash')

const { jsonPointerToParts, getPath } = require('../utils')

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
  const message = getMessage({ error })
  const path = getErrorPath({ error })
  const valueA = getValue({ path, value })
  const schemaParts = getSchemaParts({ error })
  const schemaPath = getSchemaPath({ schemaParts })
  const schemaA = getSchema({ schemaParts, schema })
  const property = getProperty({ name, path, schemaPath, target })

  const errorA = { error: message, value: valueA, schema: schemaA, property, path, schemaPath }
  const errorB = omitBy(errorA, value => value === undefined)
  return errorB
}

const getMessage = function({ error }) {
  return validator.errorsText([error], { dataVar: '' }).replace(/^\./, '')
}

// `error.dataPath` is properly escaped, e.g. can be `.NAME`, `[INDEX]` or
// `["NAME"]` for names that need to be escaped.
// However it starts with a dot, which we strip.
const getErrorPath = function({ error: { dataPath } }) {
  const path = dataPath.replace(/^\./, '')
  if (path === '') {
    return
  }

  return path
}

const getValue = function({ path, value }) {
  if (path === undefined) {
    return value
  }

  return get(value, path)
}

const getSchemaParts = function({ error: { schemaPath } }) {
  return jsonPointerToParts(schemaPath)
}

const getSchemaPath = function({ schemaParts }) {
  const schemaPathA = getPath(schemaParts)
  if (schemaPathA === '') {
    return
  }

  return schemaPathA
}

const getSchema = function({ schemaParts, schema }) {
  const key = schemaParts[schemaParts.length - 1]
  const value = get(schema, schemaParts)
  return { [key]: value }
}

// `target` is whether `error.property` should target the schema path or the value path
const getProperty = function({ name, path, schemaPath, target = 'value' }) {
  if (target === 'value') {
    return concatPaths(name, path)
  }

  return concatPaths(name, schemaPath)
}

// Concatenate two JavaScript paths
const concatPaths = function(pathA, pathB) {
  if (pathA === undefined) {
    return pathB
  }

  if (pathB === undefined) {
    return pathA
  }

  if (pathB.startsWith('[')) {
    return `${pathA}${pathB}`
  }

  return `${pathA}.${pathB}`
}

// Compilation is automatically memoized by `ajv` but not validation
const mValidateFromSchema = memoize(validateFromSchema)

module.exports = {
  validateFromSchema: mValidateFromSchema,
}
