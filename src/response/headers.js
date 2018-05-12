'use strict'

const { parseHeader } = require('../format')
const { capitalizeHeader } = require('../utils')
const { validateFromSchema } = require('./json_schema')
const { validateRequiredness } = require('./required')

// Validates response headers against OpenAPI specification
const validateHeaders = function({
  test: {
    response: { headers: testHeaders },
  },
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
  const message = `HTTP response header '${nameA}'`
  validateRequiredness({ schema: testHeader, value: fetchHeader, message })

  if (fetchHeader === undefined) {
    return { name }
  }

  const parsedHeader = parseHeader({ header: fetchHeader, schema: testHeader, collectionFormat })

  validateHeaderValue({ name: nameA, testHeader, parsedHeader, fetchHeader })

  return { name, value: parsedHeader }
}

// Validates response header against JSON schema from specification
const validateHeaderValue = function({ name, testHeader, parsedHeader, fetchHeader }) {
  const error = validateFromSchema({
    schema: testHeader,
    value: parsedHeader,
    name: `headers['${name}']`,
  })
  if (!error) {
    return
  }

  const resHeaderA = JSON.stringify(fetchHeader, null, 2)
  const errorA = `Invalid HTTP response header '${name}' with value ${resHeaderA}: ${error}`
  throw new Error(errorA)
}

module.exports = {
  validateHeaders,
}
