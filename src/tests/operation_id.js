'use strict'

const { camelCase } = require('lodash')

// Retrieve test's operationId (used in `it()` title)
const getOperationId = function({
  operationObject: {
    method,
    pathObject: { path },
    operationId,
  },
}) {
  if (operationId !== undefined && operationId !== '') {
    return operationId
  }

  return camelCase(`${method} ${path}`)
}

module.exports = {
  getOperationId,
}
