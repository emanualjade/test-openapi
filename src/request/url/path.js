'use strict'

const { filterParams } = require('../utils')

// Replace path parameters in the request URL
const addPathParams = function({ path, params }) {
  const pathParams = filterParams({ params, location: 'path' })
  const pathA = path.replace(PATH_PARAMS_REGEXP, (_, name) => getPathParam({ name, pathParams }))
  return pathA
}

// Matches path parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in path parameter names
const PATH_PARAMS_REGEXP = /\{([^}]+)\}/g

const getPathParam = function({ name, pathParams }) {
  // Path parameters are required, so we should always find one
  const { value } = pathParams.find(param => param.name === name)
  const valueA = encodeURIComponent(value)
  return valueA
}

module.exports = {
  addPathParams,
}
