'use strict'

const { mapKeys } = require('lodash')

const { locationToKey } = require('../../../utils')

// Return final value
const getReturnValue = function({ params, response }) {
  const request = normalizeRequest({ params })
  const responseA = normalizeResponse({ response })
  return { request, response: responseA }
}

const normalizeRequest = function({ params }) {
  const paramsA = params.map(normalizeParam)
  const request = Object.assign({}, ...paramsA)
  return request
}

const normalizeParam = function({ location, name, value }) {
  const key = locationToKey({ location, name })
  return { [key]: value }
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
  getReturnValue,
}
