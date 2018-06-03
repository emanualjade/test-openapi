'use strict'

const { merge } = require('lodash')

const { locationToValue } = require('../../../utils')

const { normalizeContentType, getContentTypeParam } = require('./content_type')
const { stringifyFlat } = require('./json')
const { stringifyCollFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')

// Stringify request parameters
const stringifyParams = function({ call, call: { params } }) {
  const request = getRequest({ params })

  const paramsA = normalizeContentType({ params })

  const paramsB = paramsA.map(param => stringifyParam({ param, params: paramsA }))
  const rawRequest = merge({}, ...paramsB)
  const requestA = { ...request, raw: rawRequest }

  return { call: { ...call, request: requestA } }
}

// Returned as `task.request`
const getRequest = function({ params }) {
  const paramsA = params.map(locationToValue)
  const request = merge({}, ...paramsA)
  return request
}

const stringifyParam = function({ param, param: { location, name }, params }) {
  const value = PARAM_STRINGIFIERS[location]({ param, params })
  const valueA = locationToValue({ location, name, value })
  return valueA
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
