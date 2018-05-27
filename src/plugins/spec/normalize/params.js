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
  path,
  pathDef: { parameters: pathDefParams = [] },
  operation,
  operation: { parameters: params = [] },
}) {
  const paramsA = [...pathDefParams, ...params]

  const paramsB = paramsA.map(getParam)

  const contentNegotiations = getNegotiationsParams({ spec, operation })

  const secParams = getSecParams({ spec, operation })

  const pathParam = getPathParam({ path })

  const paramsC = mergeParams([...contentNegotiations, ...secParams, ...paramsB, pathParam])

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

// Operation's path as a `task.parameters.path` parameter
const getPathParam = function({ path }) {
  const schema = { type: 'string', enum: [path] }
  return { name: 'path', location: 'path', required: true, schema }
}

module.exports = {
  getParams,
}
