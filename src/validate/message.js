'use strict'

const { mapKeys } = require('lodash')

// Since each test has random parameters, when a test fails,
// we report them for easier debugging
const validateResponseHandler = function(error, { normRequest, fetchRequest, fetchResponse }) {
  const message = getValidateError({ error, fetchRequest })
  const response = getResponse({ fetchResponse })
  Object.assign(error, { message, request: normRequest, response })

  throw error
}

const getValidateError = function({
  error: { message },
  fetchRequest: { method, url, headers, body },
}) {
  const headersA = getHeadersError({ headers })
  const bodyA = getBodyError({ body })
  const messageA = `${message}\n\nThe request was:\n${method} ${url}${headersA}${bodyA}`
  return messageA
}

const getHeadersError = function({ headers }) {
  const headersA = Object.entries(headers)

  if (headersA.length === 0) {
    return ''
  }

  const headersB = headersA.map(([name, value]) => `${name}: ${value}`).join('\n')
  const message = `\n\n${headersB}`
  return message
}

const getBodyError = function({ body }) {
  if (body === undefined || body === '') {
    return ''
  }

  return `\n\n${body}`
}

const getResponse = function({ fetchResponse: { status, headers, body } }) {
  const headersA = mapKeys(headers, (value, name) => `headers.${name}`)
  return { status, ...headersA, body }
}

module.exports = {
  validateResponseHandler,
}
