'use strict'

const { stringifyCollectionFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')
const { stringifyFlat } = require('./json')

// Stringify a request's parameters according to OpenAPI's specification
const stringifyRequest = function({ request, contentType }) {
  return request.map(param => stringifyParam({ param, contentType }))
}

const stringifyParam = function({ param, param: { location }, contentType }) {
  const value = PARAM_STRINGIFIERS[location]({ param, contentType })
  return { ...param, value }
}

// `path`, `query` and `header` values might not be strings.
// In which case they are JSON stringified
// Unless a `collectionFormat` is used
const stringifyParamFlat = function({ param: { value, name, collectionFormat } }) {
  if (Array.isArray(value)) {
    return stringifyCollectionFormat({ value, collectionFormat, name })
  }

  return stringifyFlat(value)
}

// Stringify the request body according to HTTP request header `Content-Type`
const stringifyBody = function({ param, param: { value }, contentType }) {
  // Default stringifiers tries JSON.stringify()
  const { stringify = stringifyFlat, name = DEFAULT_REQ_BODY_MIME.body } = findBodyHandler({
    mime: contentType,
  })

  try {
    return stringify(value)
  } catch (error) {
    throw new Error(`Could not send request body as ${name}: ${error.message}\n${value}`)
  }
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
