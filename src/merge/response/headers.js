'use strict'

const { mergeTestResponse } = require('../common')

// Merge `test.response.headers.*` to specification
const mergeResponseHeaders = function({
  operation: {
    response: { headers },
  },
  testOpts,
}) {
  const testHeaders = getTestHeaders({ testOpts })

  const headersA = mergeTestResponse([...headers, ...testHeaders])

  return headersA
}

// We use the `test.response['headers.NAME']` notation instead of
// `test.response.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const getTestHeaders = function({ testOpts: { response = {} } }) {
  return Object.entries(response)
    .filter(isTestHeader)
    .map(getTestHeader)
}

const isTestHeader = function([name]) {
  return name.startsWith(HEADERS_PREFIX)
}

const getTestHeader = function([name, schema]) {
  const nameA = name.replace(HEADERS_PREFIX, '').toLowerCase()

  return { name: nameA, schema }
}

// We use `test.response['headers.NAME']` notation
const HEADERS_PREFIX = 'headers.'

module.exports = {
  mergeResponseHeaders,
}
