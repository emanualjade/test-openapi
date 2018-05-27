'use strict'

const { mergeHeaders } = require('../common')
const { validateVHeader } = require('../validate')

// Merge `task.validate.headers.*` to specification
const mergeVHeaders = function({
  operation: {
    response: { headers },
  },
  validate,
}) {
  const vHeaders = getVHeaders({ validate, headers })

  const vHeadersA = mergeHeaders([...headers, ...vHeaders])

  return vHeadersA
}

// We use the `task.validate['headers.NAME']` notation instead of
// `task.validate.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const getVHeaders = function({ validate = {}, headers }) {
  return Object.entries(validate)
    .filter(isVHeader)
    .map(([name, schema]) => getVHeader({ name, schema, headers }))
}

const isVHeader = function([name]) {
  return name.startsWith(HEADERS_PREFIX)
}

const getVHeader = function({ name, schema, headers }) {
  const nameA = name.replace(HEADERS_PREFIX, '')

  const vHeader = { name: nameA, schema }

  validateVHeader({ vHeader, headers })

  return vHeader
}

// We use `task.validate['headers.NAME']` notation
const HEADERS_PREFIX = 'headers.'

module.exports = {
  mergeVHeaders,
}
