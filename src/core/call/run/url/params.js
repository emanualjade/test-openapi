'use strict'

const { TestOpenApiError } = require('../../../../errors')

// Replace `url` request parameters to the request URL
// Can replace `{...}` in both `task.call.server` and `task.call.path`
const addUrlParams = function({ url, rawRequest }) {
  return url.replace(URL_PARAM_REGEXP, (urlA, name) => getUrlParam({ name, rawRequest }))
}

// Matches `url` request parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in `url` request parameter names
const URL_PARAM_REGEXP = /\{([^}]+)\}/g

const getUrlParam = function({ name, rawRequest }) {
  const property = `task.call.url.${name}`
  const value = rawRequest[`url.${name}`]

  if (value === undefined) {
    throw new TestOpenApiError(`The URL parameter '${name}' must be defined`, { property })
  }

  return value
}

module.exports = {
  addUrlParams,
}
