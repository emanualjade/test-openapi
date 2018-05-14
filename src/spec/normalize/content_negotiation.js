'use strict'

// Get OpenAPI `consumes` and `produces` properties as request headers
const getContentNegotiationsRequest = function({ spec, operation }) {
  const contentType = getContentTypeRequest({ spec, operation })
  const accept = getAcceptRequest({ spec, operation })
  const headers = [contentType, accept].filter(header => header !== undefined)
  return headers
}

// Get OpenAPI `produces` property as a response header
const getContentNegotiationsResponse = function({ spec, operation }) {
  const contentType = getContentTypeResponse({ spec, operation })
  const headers = [contentType].filter(header => header !== undefined)
  return headers
}

const getContentTypeRequest = function({ spec, operation }) {
  const consumes = getConsumes({ spec, operation })
  const header = getContentTypeHeader(consumes)
  const headerA = addRequestInfo(header)
  return headerA
}

const getAcceptRequest = function({ spec, operation }) {
  const produces = getProduces({ spec, operation })
  const header = getAcceptHeader(produces)
  const headerA = addRequestInfo(header)
  return headerA
}

const getContentTypeResponse = function({ spec, operation }) {
  const produces = getProduces({ spec, operation })
  const header = getContentTypeHeader(produces)
  return header
}

const getConsumes = function({
  spec: { consumes: specConsumes },
  operation: { consumes = specConsumes },
}) {
  return consumes
}

const getProduces = function({
  spec: { produces: specProduces },
  operation: { produces = specProduces },
}) {
  return produces
}

// Get `consumes` and `produces` OpenAPI properties as header parameters instead
// Also works when merging with response header schemas
// A random request Content-Type will be picked
const getContentTypeHeader = function(mimes = []) {
  if (mimes.length === 0) {
    return
  }

  return { name: 'content-type', schema: { type: 'string', enum: mimes } }
}

// But the Accept header is always the same
const getAcceptHeader = function(mimes = []) {
  if (mimes.length === 0) {
    return
  }

  const accept = mimes.join(',')
  return { name: 'accept', schema: { type: 'string', enum: [accept] } }
}

const addRequestInfo = function(header) {
  if (header === undefined) {
    return
  }

  return { ...header, location: 'header', required: true }
}

module.exports = {
  getContentNegotiationsRequest,
  getContentNegotiationsResponse,
}
