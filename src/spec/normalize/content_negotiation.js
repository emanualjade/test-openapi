'use strict'

// Merge OpenAPI `consumes` and `produces` properties into request headers
const getContentNegotiationsRequest = function({ spec, operation }) {
  const { consumes: contentType, produces: accept } = getConsumesProduces({ spec, operation })

  const contentNegotiations = getContentNegotiationsHeaders({ contentType, accept })

  const contentNegotiationsA = addRequestInfo({ contentNegotiations })

  return contentNegotiationsA
}

// Merge OpenAPI `consumes` and `produces` properties into response headers
const getContentNegotiationsResponse = function({ spec, operation }) {
  const { consumes: accept, produces: contentType } = getConsumesProduces({ spec, operation })

  const contentNegotiations = getContentNegotiationsHeaders({ contentType, accept })

  return contentNegotiations
}

const getConsumesProduces = function({
  spec: { consumes: specConsumes, produces: specProduces },
  operation: { consumes = specConsumes, produces = specProduces },
}) {
  return { consumes, produces }
}

// Get `consumes` and `produces` OpenAPI properties as header parameters instead
// Also works when merging with response header schemas
const getContentNegotiationsHeaders = function({ contentType, accept }) {
  const contentTypeHeader = getContentTypeHeader(contentType)
  const acceptHeader = getAcceptHeader(accept)
  const contentNegotiations = [...contentTypeHeader, ...acceptHeader]

  return contentNegotiations
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

const addRequestInfo = function({ contentNegotiations }) {
  return contentNegotiations.map(contentNegotiation => ({
    ...contentNegotiation,
    location: 'header',
    required: true,
  }))
}

module.exports = {
  getContentNegotiationsRequest,
  getContentNegotiationsResponse,
}
