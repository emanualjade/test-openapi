'use strict'

const { mergeTestResponse } = require('../common')
const { validateTestHeader } = require('../validate')

// Merge `test.response.headers.*` to specification
const mergeResponseHeaders = function({
  operation: {
    response: { headers },
  },
  testOpts,
}) {
  const testHeaders = getTestHeaders({ testOpts, headers })

  const headersA = mergeTestResponse([...headers, ...testHeaders])

  return headersA
}

// We use the `test.response['headers.NAME']` notation instead of
// `test.response.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const getTestHeaders = function({ testOpts: { response = {} }, headers }) {
  return Object.entries(response)
    .filter(isTestHeader)
    .map(([name, schema]) => getTestHeader({ name, schema, headers }))
}

const isTestHeader = function([name]) {
  return name.startsWith(HEADERS_PREFIX)
}

const getTestHeader = function({ name, schema, headers }) {
  const nameA = name.replace(HEADERS_PREFIX, '')

  const testHeader = { name: nameA, schema }

  validateTestHeader({ testHeader, headers })

  return testHeader
}

// We use `test.response['headers.NAME']` notation
const HEADERS_PREFIX = 'headers.'

module.exports = {
  mergeResponseHeaders,
}
