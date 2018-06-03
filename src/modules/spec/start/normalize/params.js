'use strict'

const { omit } = require('lodash')

const { mergeParams, isObject } = require('../../../../utils')

const IN_TO_LOCATION = require('./in_to_location')
const { normalizeSchema } = require('./json_schema')
const { normalizeFormData } = require('./form_data')
const { getNegotiationsParams } = require('./content_negotiation')
const { getSecParams } = require('./security')

// Normalize OpenAPI request parameters into specification-agnostic format
const getParams = function({
  spec,
  method,
  path,
  pathDef: { parameters: pathDefParams = [] },
  operation,
  operation: { parameters: params = [] },
}) {
  const paramsA = [...pathDefParams, ...params]

  const paramsB = paramsA.map(getParam)

  const contentNegotiations = getNegotiationsParams({ spec, operation, params: paramsB })

  const paramsC = normalizeFormData({ params: paramsB })

  const secParams = getSecParams({ spec, operation })

  const constParams = getConstParams({ spec, method, path })

  const paramsD = mergeParams([...contentNegotiations, ...secParams, ...paramsC, ...constParams])

  const paramsE = paramsD.map(removeRandom)

  return paramsE
}

// From OpenAPI request `parameters` to normalized format
const getParam = function({ name, in: paramIn, required = false, collectionFormat, ...schema }) {
  const location = IN_TO_LOCATION[paramIn]
  const value = getSchema({ schema })
  const random = getRandom({ required })
  return { name, location, random, value, collectionFormat }
}

const getRandom = function({ required }) {
  if (required) {
    return 'shallow'
  }

  return 'optional'
}

// Normalize OpenAPI `in` to the same keys as `task.params.*`
const getSchema = function({ schema }) {
  // `allowEmptyValue` is deprecated and is ambiguous
  // (https://github.com/OAI/OpenAPI-Specification/issues/1573)
  // so we skip it
  const schemaA = omit(schema, 'allowEmptyValue')
  // OpenAPI schema can be either a `schema` property, or is directly merged in
  const schemaB = schemaA.schema || schemaA
  const schemaC = normalizeSchema({ schema: schemaB })
  return schemaC
}

// Operation's method, server and path as a `task.call.method|server|path` parameter
const getConstParams = function({ spec, method, path }) {
  const methodParam = getConstParam({ value: method, location: 'method' })
  const serverParam = getServerParam({ spec })
  const pathParam = getConstParam({ value: path, location: 'path' })

  return [methodParam, ...serverParam, pathParam]
}

const getServerParam = function({ spec: { host: hostname, basePath } }) {
  if (hostname === undefined) {
    return []
  }

  // TODO: support `spec.schemes` instead of always using HTTP
  const value = `http://${hostname}${basePath}`
  const serverParam = getConstParam({ value, location: 'server' })
  return [serverParam]
}

const getConstParam = function({ value, location }) {
  return { name: location, location, random: 'shallow', value }
}

// Use `param.random: undefined` if value is not a JSON schema
const removeRandom = function({ value, random, ...param }) {
  if (isObject(value)) {
    return { ...param, value, random }
  }

  return { ...param, value }
}

module.exports = {
  getParams,
}
