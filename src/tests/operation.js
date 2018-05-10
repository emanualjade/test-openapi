'use strict'

// Retrieve operation's HTTP method and path
const getOperation = function({
  operationObject: {
    method,
    pathObject: { path },
  },
}) {
  const methodA = method.toUpperCase()
  return { method: methodA, path }
}

module.exports = {
  getOperation,
}
