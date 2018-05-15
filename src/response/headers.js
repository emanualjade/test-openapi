'use strict'

const { parseHeader } = require('../format')

const { validateFromSchema } = require('./json_schema')
const { validateRequiredness } = require('./required')

// Validates response headers against OpenAPI specification
const validateHeaders = function({
  response: { headers: testHeaders },
  fetchResponse: { headers: fetchHeaders },
}) {
  const headers = testHeaders.map(({ name, schema: testHeader, collectionFormat }) =>
    validateHeader({ name, testHeader, collectionFormat, fetchHeaders }),
  )
  const headersA = Object.assign({}, ...headers)
  return headersA
}

const validateHeader = function({ name, testHeader, collectionFormat, fetchHeaders }) {
  const fetchHeader = getFetchHeader({ fetchHeaders, name })

  const message = `The response header '${name}'`
  validateRequiredness({ schema: testHeader, value: fetchHeader, message })

  if (fetchHeader === undefined) {
    return
  }

  const parsedHeader = parseHeader({ header: fetchHeader, schema: testHeader, collectionFormat })

  validateHeaderValue({ name, testHeader, parsedHeader, fetchHeader })

  return { [`headers.${name}`]: parsedHeader }
}

const getFetchHeader = function({ fetchHeaders, name }) {
  const nameB = Object.keys(fetchHeaders).find(nameA => nameA.toLowerCase() === name.toLowerCase())

  if (nameB === undefined) {
    return
  }

  return fetchHeaders[nameB]
}

// Validates response header against JSON schema from specification
const validateHeaderValue = function({ name, testHeader, parsedHeader, fetchHeader }) {
  const error = validateFromSchema({ schema: testHeader, value: parsedHeader })

  if (!error) {
    return
  }

  // type: response
  throw new Error(`Response header '${name}' with value '${fetchHeader}'${error}.`)
}

module.exports = {
  validateHeaders,
}
