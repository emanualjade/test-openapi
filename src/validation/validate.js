/* eslint-disable-line max-lines */
import Ajv from 'ajv'
import moize from 'moize'
import { get, omitBy } from 'lodash'
import { capitalize } from 'underscore.string'

import { jsonPointerToParts } from '../utils/json_pointer.js'
import { getPath } from '../utils/path.js'

import { defaultInstance } from './instance.js'

// Wrapper around AJV validate() that augments its error return value:
//  - error.message: better error message.
//    Can be prefixed by `arg.message`
//  - error.value|schema: specific property within value|schema that triggered
//    the error
//  - error.valuePath|schemaPath: path to error.value|schema.
//    Can be prefixed by `arg.valueProp|schemaProp`
const validateFromSchema = function({
  schema,
  value,
  valueProp,
  schemaProp,
  message,
  instance = defaultInstance,
}) {
  const passed = instance.validate(schema, value)

  if (passed) {
    return
  }

  const [error] = instance.errors

  const errorA = getError({
    error,
    schema,
    value,
    schemaProp,
    valueProp,
    message,
  })
  return errorA
}

const getError = function({
  error,
  schema,
  value,
  schemaProp,
  valueProp,
  message,
}) {
  const messageA = getMessage({ error, message, valueProp })

  const errorPath = getErrorPath({ error })
  const valueA = getValue({ errorPath, value })
  const valuePath = getValuePath({ errorPath, valueProp })

  const schemaParts = getSchemaParts({ error })
  const schemaA = getSchema({ schemaParts, schema })
  const schemaPath = getSchemaPath({ schemaParts, schemaProp })

  const errorA = {
    message: messageA,
    value: valueA,
    schema: schemaA,
    valuePath,
    schemaPath,
  }
  const errorB = omitBy(errorA, valueB => valueB === undefined)
  return errorB
}

const getMessage = function({ error, message, valueProp }) {
  const messagePrefix = getMessagePrefix({ message, valueProp })
  const errorMessage = Ajv.prototype
    .errorsText([error], { dataVar: '' })
    .replace(FIRST_CHAR_REGEXP, '')
  return `${messagePrefix}: ${errorMessage}`
}

const FIRST_CHAR_REGEXP = /^[. ]/u

const getMessagePrefix = function({ message, valueProp }) {
  if (message !== undefined) {
    return capitalize(message)
  }

  if (valueProp !== undefined) {
    return `'${valueProp}' is invalid`
  }

  return 'Value is invalid'
}

// `error.dataPath` is properly escaped, e.g. can be `.NAME`, `[INDEX]` or
// `["NAME"]` for names that need to be escaped.
// However it starts with a dot, which we strip.
const getErrorPath = function({ error: { dataPath } }) {
  return dataPath.replace(FIRST_DOT_REGEXP, '')
}

const FIRST_DOT_REGEXP = /^\./u

const getValue = function({ errorPath, value }) {
  if (errorPath === '') {
    return value
  }

  return get(value, errorPath)
}

const getValuePath = function({ errorPath, valueProp }) {
  return concatProp(valueProp, errorPath)
}

const getSchemaParts = function({ error: { schemaPath } }) {
  return jsonPointerToParts(schemaPath)
}

const getSchema = function({ schemaParts, schema }) {
  const key = schemaParts[schemaParts.length - 1]
  const value = get(schema, schemaParts)
  return { [key]: value }
}

const getSchemaPath = function({ schemaParts, schemaProp }) {
  const schemaPath = getPath(schemaParts)
  const schemaPathA = concatProp(schemaProp, schemaPath)
  return schemaPathA
}

const concatProp = function(prop, path) {
  if (prop === undefined) {
    return path
  }

  if (path === '') {
    return prop
  }

  if (path.startsWith('[')) {
    return `${prop}${path}`
  }

  return `${prop}.${path}`
}

// Compilation is automatically memoized by `ajv` but not validation
const mValidateFromSchema = moize(validateFromSchema, { isDeepEqual: true })
export { mValidateFromSchema as validateFromSchema }
