'use strict'

const { omit } = require('lodash')

const { mergeParams } = require('../../merge')

const { normalizeSchema } = require('./json_schema')
const { getNegotiationsParams } = require('./content_negotiation')
const { getSecParams } = require('./security')

// Normalize OpenAPI request parameters into specification-agnostic format
const getParams = function({
  spec,
  pathDef: { parameters: urlParams = [] },
  operation,
  operation: { parameters: params = [] },
}) {
  const paramsA = [...urlParams, ...params]

  const paramsB = paramsA.map(getParam)

  const contentNegotiations = getNegotiationsParams({ spec, operation })

  const secParams = getSecParams({ spec, operation })

  const paramsC = mergeParams([...contentNegotiations, ...secParams, ...paramsB])

  return paramsC
}

// From OpenAPI request `parameters` to normalized format
const getParam = function({ name, in: location, required = false, collectionFormat, ...schema }) {
  // `allowEmptyValue` is deprecated and is ambiguous
  // (https://github.com/OAI/OpenAPI-Specification/issues/1573)
  // so we skip it
  const schemaA = omit(schema, 'allowEmptyValue')

  const schemaB = getSchema({ schema: schemaA })
  const schemaC = normalizeSchema({ schema: schemaB })
  return { name, location, required, schema: schemaC, collectionFormat }
}

// OpenAPI schema can be either a `schema` property, or is directly merged in
const getSchema = function({ schema }) {
  return schema.schema || schema
}

module.exports = {
  getParams,
}
