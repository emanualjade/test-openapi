'use strict'

const { isObject } = require('../../../utils')

// `Content-Type` should be empty if no request body is going to be sent.
// Otherwise it should be defined.
const normalizeContentType = function({ params }) {
  const contentTypeParams = getContentTypeParams({ params })
  const paramsA = getOtherParams({ params })

  return [...contentTypeParams, ...paramsA]
}

// Find the `Content-Type` header request parameter, or add one if none
const getContentTypeParams = function({ params }) {
  const body = params.find(({ location }) => location === 'body')

  // If there is no request body, there is no `Content-Type` header
  if (body === undefined) {
    return []
  }

  const paramsA = params.filter(isContentTypeParam)

  if (paramsA.length === 0) {
    return getDefaultContentTypeParam({ body })
  }

  return paramsA
}

const getOtherParams = function({ params }) {
  return params.filter(param => !isContentTypeParam(param))
}

const isContentTypeParam = function({ location, name }) {
  return location === 'headers' && name.toLowerCase() === 'content-type'
}

// Default `Content-Type` request header if none was specified
const getDefaultContentTypeParam = function({ body }) {
  const value = getDefaultContentType({ body })
  return [{ ...DEFAULT_CONTENT_TYPE, value }]
}

const DEFAULT_CONTENT_TYPE = { name: 'Content-Type', location: 'headers' }

const getDefaultContentType = function({ body: { value: bodyValue } }) {
  if (isObject(bodyValue) || Array.isArray(bodyValue)) {
    return DEFAULT_OBJ_MIME
  }

  return DEFAULT_NON_OBJ_MIME
}

// According to HTTP specifications, we should always default to
// `application/octet-stream`. But if the request body looks like an object
// or an array, we default to `application/json` for convenience.
const DEFAULT_OBJ_MIME = 'application/json'
const DEFAULT_NON_OBJ_MIME = 'application/octet-stream'

module.exports = {
  normalizeContentType,
  isContentTypeParam,
}
