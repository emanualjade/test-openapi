'use strict'

const { hasBody } = require('type-is')

const { parseBody } = require('../format')
const { validateFromSchema } = require('./json_schema')

// Validates response body against OpenAPI specification
const validateResBody = function({
  test: { specResBody: schema },
  resBody: body,
  resHeaders: headers,
}) {
  const bodyA = body.trim()

  const isEmpty = validateResBodyEmpty({ body: bodyA, headers, schema })
  if (isEmpty) {
    return
  }

  const value = parseBody({ body: bodyA, headers })
  validateResBodyValue({ schema, value, body: bodyA })
}

// When specification's `response.schema` is defined, it means response body
// must not be empty. And vice-versa.
const validateResBodyEmpty = function({ body, headers, schema }) {
  const isEmptyHeaders = !hasBody({ headers })
  const isEmptyBody = body === ''

  if (isEmptyHeaders && !isEmptyBody) {
    throw new Error(
      `Invalid HTTP response body: response headers 'Content-Length': ${headers['content-length'] ||
        "''"} and/or 'Transfer-Encoding': ${headers['transfer-encoding'] ||
        "''"} indicate there is a response body, but the body is actually empty`,
    )
  }

  if (!isEmptyHeaders && isEmptyBody) {
    throw new Error(
      `Invalid HTTP response body: response headers 'Content-Length': ${headers['content-length'] ||
        "''"} and/or 'Transfer-Encoding': ${headers['transfer-encoding'] ||
        "''"} indicate there is no response body, but there is one`,
    )
  }

  if (isEmptyBody && schema !== undefined) {
    throw new Error('Invalid HTTP response body: it should not be empty')
  }

  if (!isEmptyBody && schema === undefined) {
    throw new Error(
      `Invalid HTTP response body: it should be empty instead of:\n${JSON.stringify(body)}`,
    )
  }

  return isEmptyBody
}

const validateResBodyValue = function({ schema, value, body }) {
  const error = validateFromSchema({ schema, value, name: 'body' })
  if (!error) {
    return
  }

  const errorA = `Invalid HTTP response body: ${error}\nResponse body was:\n${body}\n`
  throw new Error(errorA)
}

module.exports = {
  validateResBody,
}
