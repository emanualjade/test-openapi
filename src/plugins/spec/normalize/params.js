'use strict'

const { omit } = require('lodash')

const { mergeParams } = require('../../../utils')

const { normalizeSchema } = require('./json_schema')
const { getNegotiationsParams } = require('./content_negotiation')
const { getSecParams } = require('./security')
const IN_TO_LOCATION = require('./in_to_location')

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

  const contentNegotiations = getNegotiationsParams({ spec, operation })

  const secParams = getSecParams({ spec, operation })

  const constParams = getConstParams({ spec, method, path })

  const paramsC = mergeParams([...contentNegotiations, ...secParams, ...paramsB, ...constParams])

  return paramsC
}

// From OpenAPI request `parameters` to normalized format
const getParam = function({ name, in: paramIn, required = false, collectionFormat, ...schema }) {
  const location = IN_TO_LOCATION[paramIn]
  const schemaA = getSchema({ schema })
  return { name, location, required, schema: schemaA, collectionFormat }
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

// Operation's method, server and path as a `task.parameters.method|server|path` parameter
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
  const schema = { type: 'string', enum: [value] }
  return { name: location, location, required: true, schema }
}

module.exports = {
  getParams,
}
