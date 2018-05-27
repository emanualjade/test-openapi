'use strict'

const { stringifyCollFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')
const { stringifyFlat } = require('./json')

// Stringify request's parameters
const stringifyRequest = function({ request }) {
  return request.map(param => stringifyParam({ param, request }))
}

const stringifyParam = function({ param, param: { location }, request }) {
  const value = PARAM_STRINGIFIERS[location]({ param, request })
  return { ...param, value }
}

// `path`, `query` and `header` values might not be strings.
// In which case they are JSON stringified
// Unless a `collectionFormat` is used
const stringifyParamFlat = function({ param: { value, name, collectionFormat } }) {
  if (Array.isArray(value)) {
    return stringifyCollFormat({ value, collectionFormat, name })
  }

  return stringifyFlat(value)
}

// Stringify the request body according to HTTP request header `Content-Type`
const stringifyBody = function({ param: { value }, request }) {
  const mime = getBodyMime({ request })

  // Default stringifiers tries JSON.stringify()
  const { stringify = stringifyFlat } = findBodyHandler({ mime })

  return stringify(value)
}

// Retrieve the `Content-Type` header to set in the request
const getBodyMime = function({ request }) {
  const contentTypeParam = request.find(isContentTypeParam)

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

const DEFAULT_REQ_BODY_MIME = {
  formData: 'application/x-www-form-urlencoded',
  body: 'application/octet-stream',
}

module.exports = {
  stringifyRequest,
  DEFAULT_REQ_BODY_MIME,
}
