'use strict'

const { filterFormDataMimes } = require('./form_data')

// Get OpenAPI `consumes` and `produces` properties as request headers
const getNegotiationsParams = function({ spec, operation, params }) {
  const contentType = getContentTypeParam({ spec, operation, params })
  const accept = getAcceptParam({ spec, operation })
  const headers = [contentType, accept].filter(header => header !== undefined)
  return headers
}

// Get OpenAPI `produces` property as a response header
const getNegotiationsResponse = function({ spec, operation }) {
  const contentType = getContentTypeResponse({ spec, operation })
  const headers = [contentType].filter(header => header !== undefined)
  return headers
}

const getContentTypeParam = function({ spec, operation, params }) {
  const consumes = getConsumes({ spec, operation })
  const consumesA = filterFormDataMimes({ mimes: consumes, params })
  const header = getContentTypeHeader(consumesA)
  const headerA = addParamInfo(header)
  return headerA
}

const getAcceptParam = function({ spec, operation }) {
  const produces = getProduces({ spec, operation })
  const header = getAcceptHeader(produces)
  const headerA = addParamInfo(header)
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
const getContentTypeHeader = function(mimes) {
  if (mimes === undefined) {
    return
  }

  return { name: 'Content-Type', value: { type: 'string', enum: mimes } }
}

// But the Accept header is always the same
const getAcceptHeader = function(mimes) {
  if (mimes === undefined) {
    return
  }

  const accept = mimes.join(',')
  return { name: 'Accept', value: accept }
}

const addParamInfo = function(header) {
  if (header === undefined) {
    return
  }

  return { ...header, location: 'headers', required: true }
}

module.exports = {
  getNegotiationsParams,
  getNegotiationsResponse,
}
