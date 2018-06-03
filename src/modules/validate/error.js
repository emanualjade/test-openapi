'use strict'

const { omit, omitBy } = require('lodash')

// Normalize `task.error.validate`
const error = function({ status, body, ...headers }) {
  // Those are normalized headers, not part of originalTask
  const headersA = omit(headers, 'headers')

  const errorProps = { status, ...headersA, body }
  const errorPropsA = omitBy(errorProps, value => value === undefined)
  return errorPropsA
}

module.exports = {
  error,
}
