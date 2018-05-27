'use strict'

const METHODS = require('methods')

const { TestOpenApiError } = require('../../../errors')

// Retrieve `task.call.method`
const getMethod = function({ rawRequest: { method = DEFAULT_METHOD } }) {
  validateMethod({ method })

  return method
}

const DEFAULT_METHOD = 'GET'

const validateMethod = function({ method }) {
  if (METHODS.includes(method.toLowerCase())) {
    return
  }

  throw new TestOpenApiError(`HTTP method '${method}' does not exist`, {
    property: 'call.method',
    actual: method,
  })
}

module.exports = {
  getMethod,
}
