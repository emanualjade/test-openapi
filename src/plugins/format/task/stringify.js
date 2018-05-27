'use strict'

const { locationToKey } = require('../../../utils')

const { normalizeContentType, getContentTypeParam } = require('./content_type')
const { stringifyFlat } = require('./json')
const { stringifyCollFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')

// Stringify request parameters
const stringifyParams = function({ params }) {
  const paramsA = normalizeContentType({ params })

  const paramsB = paramsA.map(param => stringifyParam({ param, params: paramsA }))
  const rawRequest = Object.assign({}, ...paramsB)
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
const stringifyParamFlat = function({ param: { value, name, collectionFormat } }) {
  if (Array.isArray(value)) {
    return stringifyCollFormat({ value, collectionFormat, name })
  }

  return stringifyFlat(value)
}

// Stringify the request body according to HTTP request header `Content-Type`
const stringifyBody = function({ param: { value }, params }) {
  const { value: mime } = getContentTypeParam({ params })

  // Default stringifiers tries JSON.stringify()
  const { stringify = stringifyFlat } = findBodyHandler({ mime })

  return stringify(value)
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
