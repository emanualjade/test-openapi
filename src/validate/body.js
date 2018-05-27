'use strict'

const { throwResponseError } = require('../errors')
const { parseBody } = require('../format')
const { validateFromSchema } = require('../utils')

const { validateRequiredBody } = require('./required')

// Validates response body against OpenAPI specification
const validateBody = function({
  response: { body: testBody },
  fetchResponse: { body: fetchBody, headers: fetchHeaders },
}) {
  const fetchBodyA = trimBody({ fetchBody })

  validateRequiredBody({ schema: testBody, value: fetchBodyA })

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
  const { error } = validateFromSchema({ schema: testBody, value: parsedBody })

  if (error === undefined) {
    return
  }

  const property = 'response.body'
  throwResponseError(`Response body${error}.\nThe response body was:\n${fetchBody}`, {
    property,
    expected: testBody,
    actual: parsedBody,
  })
}

module.exports = {
  validateBody,
}
