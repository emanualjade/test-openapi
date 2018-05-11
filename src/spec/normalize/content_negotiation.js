'use strict'

const { omit } = require('lodash')

const { mergeItems } = require('../../utils')

// Merge OpenAPI `consumes` and `produces` properties into request headers and response headers
const addContentNegotiations = function({ spec, operation, items, isRequest = true }) {
  const { contentType, accept } = getContentTypeAccept({ spec, operation, isRequest })
  const contentNegotiations = getContentNegotiations({ contentType, accept, isRequest })
  const itemsA = mergeContentNegotiations({ items, contentNegotiations, isRequest })
  return itemsA
}

const getContentTypeAccept = function({ spec, operation, isRequest }) {
  const { consumes, produces } = getConsumesProduces({ spec, operation })

  if (isRequest) {
    return { contentType: consumes, accept: produces }
  }

  return { contentType: produces, accept: consumes }
}

const getConsumesProduces = function({
  spec: { consumes: specConsumes, produces: specProduces },
  operation: { consumes = specConsumes, produces = specProduces },
}) {
  return { consumes, produces }
}

// Get `consumes` and `produces` OpenAPI properties as header parameters instead
// Also works when merging with response header schemas
const getContentNegotiations = function({ contentType, accept, isRequest }) {
  const contentTypeHeader = getContentTypeHeader(contentType)
  const acceptHeader = getAcceptHeader(accept)
  const contentNegotiations = [...contentTypeHeader, ...acceptHeader]

  const contentNegotiationsA = normalizeNonParams({ contentNegotiations, isRequest })
  return contentNegotiationsA
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

// Response headers have a different shape than parameters
const normalizeNonParams = function({ contentNegotiations, isRequest }) {
  if (isRequest) {
    return contentNegotiations
  }

  return contentNegotiations.map(contentNegotiation =>
    omit(contentNegotiation, ['location', 'required']),
  )
}

const mergeContentNegotiations = function({ items, contentNegotiations, isRequest }) {
  const itemsA = [...contentNegotiations, ...items]
  const itemsB = mergeItems({ items: itemsA, isRequest })
  return itemsB
}

module.exports = {
  addContentNegotiations,
}
