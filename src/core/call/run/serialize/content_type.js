import { isObject } from '../../../../utils/types.js'

// `Content-Type` should be empty if no request body is going to be sent.
// Also add a default one.
export const normalizeContentType = function({
  call,
  call: { body },
  call: { 'headers.content-type': contentTypeParam, ...noBodyCall },
}) {
  // If there is no request body, there is no `Content-Type` header
  if (body === undefined) {
    return noBodyCall
  }

  // If there is no `Content-Type`, use a default
  if (contentTypeParam === undefined) {
    const contentType = getDefaultContentType({ body })
    return { ...call, 'headers.content-type': contentType }
  }

  return call
}

// Default `Content-Type` request header if none was specified
const getDefaultContentType = function({ body }) {
  if (isObject(body) || Array.isArray(body)) {
    return DEFAULT_OBJ_MIME
  }

  return DEFAULT_NON_OBJ_MIME
}

// According to HTTP specifications, we should always default to
// `application/octet-stream`. But if the request body looks like an object
// or an array, we default to `application/json` for convenience.
const DEFAULT_OBJ_MIME = 'application/json'
const DEFAULT_NON_OBJ_MIME = 'application/octet-stream'
