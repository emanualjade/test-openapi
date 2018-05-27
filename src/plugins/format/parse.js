'use strict'

const { mapValues } = require('lodash')

const { usesCollFormat, parseCollFormat } = require('./collection_format')
const { findBodyHandler } = require('./body')

const parseResponse = function({
  rawResponse: { status, headers, body },
  validate: { headers: vHeaders },
  config: { dry },
}) {
  if (dry) {
    return
  }

  const headersA = parseHeaders({ headers, vHeaders })
  const bodyA = parseBody({ body, headers })

  const response = { status, headers: headersA, body: bodyA }
  return { response }
}

// Parses a response's headers
const parseHeaders = function({ headers, vHeaders }) {
  return mapValues(headers, (header, name) => parseHeader({ name, header, vHeaders }))
}

const parseHeader = function({ name, header, vHeaders }) {
  const vHeader = vHeaders.find(({ name: nameA }) => nameA.toLowerCase() === name.toLowerCase())

  // Do not parse headers not present in `task.validate`
  if (vHeader === undefined) {
    return header
  }

  const { schema, collectionFormat } = vHeader
  const headerA = parseHeaderValue({ header, schema, collectionFormat })
  return headerA
}

// Try to parse header value if its JSON schema `type` is not `string`
const parseHeaderValue = function({ header, schema, collectionFormat }) {
  const headerA = header.trim()

  // Response header values that are arrays can either use JSON or OpenAPI `collectionFormat`
  if (usesCollFormat({ value: headerA, schema })) {
    return parseCollFormat({ value: headerA, collectionFormat })
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
  const bodyA = trimBody({ body })

  if (bodyA === undefined) {
    return bodyA
  }

  const mime = headers['content-type']
  const { parse } = findBodyHandler({ mime })

  // Defaults to leaving as is
  if (parse === undefined) {
    return bodyA
  }

  return parse(bodyA)
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

module.exports = {
  parseResponse,
}
