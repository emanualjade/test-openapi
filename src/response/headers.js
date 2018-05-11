'use strict'

const { parseHeader } = require('../format')
const { capitalizeHeader } = require('../utils')
const { validateFromSchema } = require('./json_schema')
const { validateRequiredness } = require('./required')

// Validates response headers against OpenAPI specification
const validateHeaders = function({
  test: {
    response: { headers },
  },
  resHeaders,
}) {
  headers.forEach(({ name, schema, collectionFormat }) =>
    validateHeader({ name, schema, collectionFormat, resHeader: resHeaders[name] }),
  )
}

const validateHeader = function({ name, schema, collectionFormat, resHeader }) {
  const nameA = capitalizeHeader({ name })
  const message = `HTTP response header '${nameA}'`
  validateRequiredness({ schema, value: resHeader, message })

  if (resHeader === undefined) {
    return
  }

  const value = parseHeader({ header: resHeader, schema, collectionFormat })
  validateHeaderValue({ name: nameA, schema, value, resHeader })
}

// Validates response header against JSON schema from specification
const validateHeaderValue = function({ name, schema, value, resHeader }) {
  const error = validateFromSchema({ schema, value, name: `headers['${name}']` })
  if (!error) {
    return
  }

  const resHeaderA = JSON.stringify(resHeader, null, 2)
  const errorA = `Invalid HTTP response header '${name}' with value ${resHeaderA}: ${error}`
  throw new Error(errorA)
}

module.exports = {
  validateHeaders,
}
