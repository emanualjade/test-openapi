'use strict'

const { mergeItems } = require('../../utils')
const { normalizeSchema } = require('./json_schema')
const { getContentNegotiations } = require('./content_negotiation')
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

  const contentNegotiations = getContentNegotiations({ spec, operation, isRequest: true })

  const secParams = getSecParams({ spec, operation })

  const items = [...contentNegotiations, ...secParams, ...parametersB]
  const parametersC = mergeItems({ items, isRequest: true })

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
  const schemaA = getSchema({ schema })
  const schemaB = normalizeSchema({ schema: schemaA })
  return { name, location, required, schema: schemaB, collectionFormat }
}

// OpenAPI schema can be either a `schema` property, or is directly merged in
const getSchema = function({ schema }) {
  return schema.schema || schema
}

module.exports = {
  getParameters,
}
