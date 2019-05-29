import { mapValues } from 'lodash'

import { parseFlat } from '../../../utils/flat.js'
import { TestOpenApiError } from '../../../errors/error.js'
import { findBodyHandler } from '../body.js'

// Parse response
export const parse = function({
  call,
  call: { rawResponse: { status, body, ...headers } = {} } = {},
}) {
  if (call === undefined) {
    return
  }

  const headersA = parseHeaders({ headers })
  const bodyA = parseBody({ body, headers: headersA })

  const response = { status, ...headersA, body: bodyA }
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
  const mime = headers['headers.content-type']

  const { parse: parseFunc, name } = findBodyHandler({ mime })

  // Defaults to leaving as is
  if (parseFunc === undefined) {
    return bodyA
  }

  try {
    return parseFunc(bodyA)
  } catch (error) {
    throw new TestOpenApiError(
      `Could not read response body as ${name}: ${error.message}`,
      { property: 'task.call.response.body' },
    )
  }
}

const trimBody = function({ body }) {
  const bodyA = body.trim()

  // Convert body to `undefined` when empty
  if (bodyA === '') {
    return
  }

  return bodyA
}
