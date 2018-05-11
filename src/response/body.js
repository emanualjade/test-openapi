'use strict'

const { parseBody } = require('../format')
const { validateFromSchema } = require('./json_schema')
const { validateRequiredness } = require('./required')

// Validates response body against OpenAPI specification
const validateBody = function({
  test: {
    response: { body: schema },
  },
  resBody: body,
  resHeaders: headers,
}) {
  const bodyA = trimBody({ body })

  const message = 'HTTP response body'
  validateRequiredness({ schema, value: bodyA, message })

  if (bodyA === undefined) {
    return
  }

  const value = parseBody({ body: bodyA, headers })

  validateBodyValue({ schema, value, body: bodyA })

  return value
}

const trimBody = function({ body }) {
  const bodyA = body.trim()

  // Convert body to `undefined` when empty so we can re-use same logic as
  // response headers for requiredness checks
  if (bodyA === '') {
    return
  }

  return bodyA
}

const validateBodyValue = function({ schema, value, body }) {
  const error = validateFromSchema({ schema, value, name: 'body' })
  if (!error) {
    return
  }

  const errorA = `Invalid HTTP response body: ${error}\nResponse body was:\n${body}\n`
  throw new Error(errorA)
}

module.exports = {
  validateBody,
}
