'use strict'

const { isObject, mergeParams } = require('../../utils')

// `Content-Type` should be empty if no request body is going to be sent.
// Otherwise it should be defined.
const normalizeContentType = function({ params }) {
  const contentTypeParam = getContentTypeParam({ params })

  const contentTypeParamA = normalizeContentTypeParam({ contentTypeParam, params })

  const paramsA = mergeParams([...params, contentTypeParamA])
  return paramsA
}

// Find the `Content-Type` header request parameter, or add one if none
const getContentTypeParam = function({ params }) {
  return params.find(isContentTypeParam) || DEFAULT_CONTENT_TYPE
}

const isContentTypeParam = function({ location, name }) {
  return location === 'headers' && name.toLowerCase() === 'content-type'
}

const DEFAULT_CONTENT_TYPE = { name: 'Content-Type', location: 'headers' }

const normalizeContentTypeParam = function({ contentTypeParam, params }) {
  const body = params.find(({ location }) => location === 'body')

  // If there is no request body, there is no `Content-Type` header
  if (body === undefined) {
    return
  }

  // Otherwise, make sure it is defined
  const contentTypeParamA = addDefaultContentType({ contentTypeParam, body })
  return contentTypeParamA
}

const addDefaultContentType = function({ contentTypeParam, body }) {
  const valueA = getDefaultContentType({ contentTypeParam, body })
  return { ...contentTypeParam, value: valueA }
}

const getDefaultContentType = function({
  contentTypeParam: { value: contentType },
  body: { value: bodyValue },
}) {
  if (contentType !== undefined) {
    return contentType
  }

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
  getContentTypeParam,
}
