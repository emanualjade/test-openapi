'use strict'

const { mergeHeaders } = require('../common')

// Merge `task.validate.headers.*` to specification
const mergeVHeaders = function({
  operation: {
    response: { headers },
  },
  validate,
}) {
  const vHeaders = getVHeaders({ validate })

  const vHeadersA = mergeHeaders([...headers, ...vHeaders])

  return vHeadersA
}

// We use the `task.validate['headers.NAME']` notation instead of
// `task.validate.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const getVHeaders = function({ validate = {} }) {
  return Object.entries(validate)
    .filter(isVHeader)
    .map(getVHeader)
}

const isVHeader = function([name]) {
  return HEADERS_PREFIX_REGEXP.test(name)
}

const getVHeader = function([name, schema]) {
  const nameA = name.replace(HEADERS_PREFIX_REGEXP, '')
  return { name: nameA, schema }
}

// We use `task.validate['headers.NAME']` notation
const HEADERS_PREFIX_REGEXP = /^headers\./

module.exports = {
  mergeVHeaders,
}
