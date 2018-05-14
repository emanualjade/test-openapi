'use strict'

const { parseHeader } = require('../format')
const { capitalizeHeader } = require('../utils')
const { validateFromSchema } = require('./json_schema')
const { validateRequiredness } = require('./required')

// Validates response headers against OpenAPI specification
const validateHeaders = function({
  response: { headers: testHeaders },
  fetchResponse: { headers: fetchHeaders },
}) {
  const headers = testHeaders.map(({ name, schema: testHeader, collectionFormat }) =>
    validateHeader({ name, testHeader, collectionFormat, fetchHeader: fetchHeaders[name] }),
  )
  const headersA = Object.assign({}, ...headers)
  return headersA
}

const validateHeader = function({ name, testHeader, collectionFormat, fetchHeader }) {
  const nameA = capitalizeHeader({ name })
  const message = `The response header '${nameA}'`
  validateRequiredness({ schema: testHeader, value: fetchHeader, message })

  if (fetchHeader === undefined) {
    return
  }

  const parsedHeader = parseHeader({ header: fetchHeader, schema: testHeader, collectionFormat })

  validateHeaderValue({ name: nameA, testHeader, parsedHeader, fetchHeader })

  return { [`headers.${name}`]: parsedHeader }
}

// Validates response header against JSON schema from specification
const validateHeaderValue = function({ name, testHeader, parsedHeader, fetchHeader }) {
  const error = validateFromSchema({ schema: testHeader, value: parsedHeader })
  if (!error) {
    return
  }

  const errorA = `Invalid response header '${name}' with value '${fetchHeader}':${error}.`
  throw new Error(errorA)
}

module.exports = {
  validateHeaders,
}
