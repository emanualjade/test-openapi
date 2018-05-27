'use strict'

const { objectifyParams, stringifyFlat } = require('../../utils')

const { stringifyCollFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')
const { addFullUrl } = require('./url')

// Stringify request parameters
const stringifyParams = function({ params, operation, config }) {
  const paramsA = params.map(param => stringifyParam({ param, params }))
  const rawRequest = objectifyParams({ params: paramsA })
  const rawRequestA = addFullUrl({ rawRequest, operation, config })
  return { rawRequest: rawRequestA }
}

const stringifyParam = function({ param, param: { location }, params }) {
  const value = PARAM_STRINGIFIERS[location]({ param, params })
  return { ...param, value }
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
  const mime = getBodyMime({ params })

  // Default stringifiers tries JSON.stringify()
  const { stringify = stringifyFlat } = findBodyHandler({ mime })

  return stringify(value)
}

// Retrieve the `Content-Type` header to set in the request
const getBodyMime = function({ params }) {
  const contentTypeParam = params.find(isContentTypeParam)

  if (contentTypeParam === undefined) {
    return
  }

  return contentTypeParam.value
}

const isContentTypeParam = function({ location, name }) {
  return location === 'header' && name.toLowerCase() === 'content-type'
}

// TODO: not supported yet
const stringifyParamFormData = function({ param: { value } }) {
  return value
}

const PARAM_STRINGIFIERS = {
  path: stringifyParamFlat,
  query: stringifyParamFlat,
  header: stringifyParamFlat,
  body: stringifyBody,
  formData: stringifyParamFormData,
}

module.exports = {
  stringifyParams,
}
