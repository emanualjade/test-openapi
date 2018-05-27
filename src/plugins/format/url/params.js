'use strict'

// Replace `url` request parameters to the request URL
const addUrlParams = function({ path, rawRequest }) {
  return path.replace(URL_PARAM_REGEXP, (pathA, name) => getPathParam({ name, rawRequest }))
}

// Matches `url` request parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in `url` request parameter names
const URL_PARAM_REGEXP = /\{([^}]+)\}/g

const getPathParam = function({ name, rawRequest }) {
  // `url` request parameters are required, so we should always find one
  const value = rawRequest[`url.${name}`]
  const valueA = encodeURIComponent(value)
  return valueA
}

module.exports = {
  addUrlParams,
}
