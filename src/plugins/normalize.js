'use strict'

const { mapKeys } = require('lodash')

// Return final value
const normalizeReturnValue = function({ params, response }) {
  const request = normalizeRequest({ params })
  const responseA = normalizeResponse({ response })
  return { request, response: responseA }
}

const normalizeRequest = function({ params }) {
  const paramsA = params.map(({ location, name, value }) => ({ [`${location}.${name}`]: value }))
  const request = Object.assign({}, ...paramsA)
  return request
}

// From `{ status, headers, body }` to `{ status, 'headers.*': ..., body }`
const normalizeResponse = function({ response: { headers, ...response } = {} }) {
  if (headers === undefined) {
    return response
  }

  const headersA = mapKeys(headers, (value, name) => `headers.${name}`)
  return { ...response, ...headersA }
}

module.exports = {
  normalizeReturnValue,
}
