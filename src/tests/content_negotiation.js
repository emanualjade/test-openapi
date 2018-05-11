'use strict'

// Get `consumes` and `produces` OpenAPI properties as header parameters instead
// Also works when merging with response header schemas
const getContentNegotiations = function({ contentType, accept }) {
  const contentTypeHeader = getContentTypeHeader(contentType)
  const acceptHeader = getAcceptHeader(accept)
  return [...contentTypeHeader, ...acceptHeader]
}

// A random request Content-Type will be picked
const getContentTypeHeader = function(mimes = []) {
  if (mimes.length === 0) {
    return []
  }

  return [
    {
      name: 'content-type',
      location: 'header',
      required: true,
      schema: { type: 'string', enum: mimes },
    },
  ]
}

// But the Accept header is always the same
const getAcceptHeader = function(mimes = []) {
  if (mimes.length === 0) {
    return []
  }

  const accept = mimes.join(',')
  return [
    {
      name: 'accept',
      location: 'header',
      required: true,
      schema: { type: 'string', enum: [accept] },
    },
  ]
}

module.exports = {
  getContentNegotiations,
}
