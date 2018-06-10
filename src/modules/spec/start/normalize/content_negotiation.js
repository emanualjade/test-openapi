'use strict'

const { filterFormDataMimes } = require('./form_data')

// Get OpenAPI `consumes` and `produces` properties as request headers
const getNegotiationsParams = function({ spec, operation, params }) {
  const contentType = getContentTypeParam({ spec, operation, params })
  const accept = getAcceptParam({ spec, operation })
  const headers = [contentType, accept].filter(header => header !== undefined)
  return headers
}

// Get `consumes` and `produces` OpenAPI properties as header parameters instead
// A random request Content-Type will be picked
const getContentTypeParam = function({ spec, operation, params }) {
  const consumes = getConsumes({ spec, operation })
  const consumesA = filterFormDataMimes({ mimes: consumes, params })

  if (consumesA === undefined) {
    return
  }

  const value = { type: 'string', enum: consumesA }
  return { name: 'Content-Type', value, location: 'headers', random: 'shallow' }
}

// But the Accept header is always the same
const getAcceptParam = function({ spec, operation }) {
  const produces = getProduces({ spec, operation })
  if (produces === undefined) {
    return
  }

  const value = produces.join(',')
  return { name: 'Accept', value, location: 'headers' }
}

// Get OpenAPI `produces` property as a `Content-Type` response header
const getNegotiationsResponse = function({ spec, operation }) {
  const produces = getProduces({ spec, operation })
  if (produces === undefined) {
    return
  }

  return { 'Content-Type': { type: 'string', enum: produces } }
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

module.exports = {
  getNegotiationsParams,
  getNegotiationsResponse,
}
