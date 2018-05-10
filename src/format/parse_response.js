'use strict'

const { usesCollectionFormat, parseCollectionFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')

// Parses a response's header according to OpenAPI specification
// Try to parse header value if its JSON schema `type` is not `string`
const parseHeader = function({ header, schema, collectionFormat }) {
  const headerA = header.trim()

  // Response header values that are arrays can either use JSON or OpenAPI `collectionFormat`
  if (usesCollectionFormat({ value: headerA, schema })) {
    return parseCollectionFormat({ value: headerA, collectionFormat })
  }

  // If `schema.type` is an array including `string`, it will still work when
  // trying to JSON.parse() first
  if (schema.type === 'string') {
    return headerA
  }

  try {
    return JSON.parse(headerA)
  } catch (error) {
    return headerA
  }
}

// Parses a response's body according to its `Content-Type`
const parseBody = function({ body, headers }) {
  const mime = headers['content-type']
  const { parse, name } = findBodyHandler({ mime })

  // Defaults to leaving as is
  if (parse === undefined) {
    return body
  }

  try {
    return parse(body)
  } catch (error) {
    throw new Error(`Could not read response body as ${name}: ${error.message}\n${body}`)
  }
}

module.exports = {
  parseHeader,
  parseBody,
}
