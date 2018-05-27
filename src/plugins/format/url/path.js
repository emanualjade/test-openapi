'use strict'

// Replace path parameters in the request URL
const addPathParam = function({ path, rawRequest }) {
  return path.replace(PATH_PARAM_REGEXP, (pathA, name) => getPathParam({ name, rawRequest }))
}

// Matches path request parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in path request parameter names
const PATH_PARAM_REGEXP = /\{([^}]+)\}/g

const getPathParam = function({ name, rawRequest }) {
  // Path request parameters are required, so we should always find one
  const { value } = rawRequest[`path.${name}`]
  const valueA = encodeURIComponent(value)
  return valueA
}

module.exports = {
  addPathParam,
}
