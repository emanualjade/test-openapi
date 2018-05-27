'use strict'

const { locationToKey } = require('../../utils')

const { stringifyFlat } = require('./json')
const { stringifyCollFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')

// Stringify request parameters
const stringifyParams = function({ params }) {
  const paramsA = params.map(param => stringifyParam({ param, params }))
  const rawRequest = Object.assign({}, ...paramsA)
  return { rawRequest }
}

const stringifyParam = function({ param, param: { location, name }, params }) {
  const key = locationToKey({ location, name })
  const value = PARAM_STRINGIFIERS[location]({ param, params })
  return { [key]: value }
}

// `url`, `query` and `header` values might not be strings.
// In which case they are JSON stringified
// Unless a `collectionFormat` is used
const stringifyParamFlat = function({ param: { schema, name, collectionFormat } }) {
  if (Array.isArray(schema)) {
    return stringifyCollFormat({ value: schema, collectionFormat, name })
  }

  return stringifyFlat(schema)
}

// Stringify the request body according to HTTP request header `Content-Type`
const stringifyBody = function({ param: { schema }, params }) {
  const mime = getBodyMime({ params })

  // Default stringifiers tries JSON.stringify()
  const { stringify = stringifyFlat } = findBodyHandler({ mime })

  return stringify(schema)
}

// Retrieve the `Content-Type` header to set in the request
const getBodyMime = function({ params }) {
  const contentTypeParam = params.find(isContentTypeParam)

  if (contentTypeParam === undefined) {
    return
  }

  return contentTypeParam.schema
}

const isContentTypeParam = function({ location, name }) {
  return location === 'headers' && name.toLowerCase() === 'content-type'
}

const PARAM_STRINGIFIERS = {
  method: stringifyParamFlat,
  server: stringifyParamFlat,
  path: stringifyParamFlat,
  url: stringifyParamFlat,
  query: stringifyParamFlat,
  headers: stringifyParamFlat,
  body: stringifyBody,
}

module.exports = {
  stringifyParams,
}
