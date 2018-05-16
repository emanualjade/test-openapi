'use strict'

const { omit } = require('lodash')

const { mergeRequest } = require('../../merge')

const { normalizeSchema } = require('./json_schema')
const { getNegotiationsRequest } = require('./content_negotiation')
const { getSecParams } = require('./security')

// Normalize OpenAPI request parameters into specification-agnostic format
const getParameters = function({
  spec,
  pathDef: { parameters: pathParameters = [] },
  operation,
  operation: { parameters = [] },
}) {
  const parametersA = [...pathParameters, ...parameters]

  const parametersB = parametersA.map(getParameter)

  const contentNegotiations = getNegotiationsRequest({ spec, operation })

  const secParams = getSecParams({ spec, operation })

  const parametersC = mergeRequest([...contentNegotiations, ...secParams, ...parametersB])

  return parametersC
}

// From OpenAPI request `parameters` to normalized format
const getParameter = function({
  name,
  in: location,
  required = false,
  collectionFormat,
  ...schema
}) {
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
  getParameters,
}
