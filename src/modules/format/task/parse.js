'use strict'

const { mapValues } = require('lodash')

const { findBodyHandler } = require('./body')
const { parseFlat } = require('./json')

// Parse response
const parseResponse = function({
  call,
  call: {
    response: {
      raw,
      raw: { status, headers, body },
    },
  },
}) {
  const headersA = parseHeaders({ headers })
  const bodyA = parseBody({ body, headers })

  const response = { raw, status, headers: headersA, body: bodyA }
  return { call: { ...call, response } }
}

// Parses a response's headers
const parseHeaders = function({ headers }) {
  return mapValues(headers, parseHeader)
}

const parseHeader = function(header) {
  const headerA = header.trim()
  // Headers that look like numbers, booleans or `null` will never be parsed as
  // a string, but as those types instead
  const headerB = parseFlat(headerA)
  return headerB
}

// Parses a response's body according to its `Content-Type`
const parseBody = function({ body, headers }) {
  const bodyA = trimBody({ body })

  if (bodyA === undefined) {
    return bodyA
  }

  // On bad servers, this could be undefined
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
