'use strict'

const { filterRequest } = require('../utils')

// Replace path parameters in the request URL
const addPathRequest = function({ path, request }) {
  const pathRequest = filterRequest({ request, location: 'path' })
  const pathB = path.replace(PATH_REQUEST_REGEXP, (pathA, name) =>
    getPathParam({ name, pathRequest }),
  )
  return pathB
}

// Matches path request parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in path request parameter names
const PATH_REQUEST_REGEXP = /\{([^}]+)\}/g

const getPathParam = function({ name, pathRequest }) {
  // Path request parameters are required, so we should always find one
  const { value } = pathRequest.find(param => param.name === name)
  const valueA = encodeURIComponent(value)
  return valueA
}

module.exports = {
  addPathRequest,
}
