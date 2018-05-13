'use strict'

const { parseBody } = require('../format')
const { validateFromSchema } = require('./json_schema')
const { validateRequiredness } = require('./required')

// Validates response body against OpenAPI specification
const validateBody = function({
  response: { body: testBody },
  fetchResponse: { body: fetchBody, headers: fetchHeaders },
}) {
  const fetchBodyA = trimBody({ fetchBody })

  const message = 'HTTP response body'
  validateRequiredness({ schema: testBody, value: fetchBodyA, message })

  if (fetchBodyA === undefined) {
    return
  }

  const parsedBody = parseBody({ body: fetchBodyA, headers: fetchHeaders })

  validateBodyValue({ testBody, parsedBody, fetchBody: fetchBodyA })

  return parsedBody
}

const trimBody = function({ fetchBody }) {
  const fetchBodyA = fetchBody.trim()

  // Convert body to `undefined` when empty so we can re-use same logic as
  // response headers for requiredness checks
  if (fetchBodyA === '') {
    return
  }

  return fetchBodyA
}

const validateBodyValue = function({ testBody, parsedBody, fetchBody }) {
  const error = validateFromSchema({ schema: testBody, value: parsedBody, name: 'body' })
  if (!error) {
    return
  }

  const errorA = `Invalid HTTP response body: ${error}\nResponse body was:\n${fetchBody}\n`
  throw new Error(errorA)
}

module.exports = {
  validateBody,
}
