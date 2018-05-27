'use strict'

const { throwTaskError } = require('../../../errors')

// Replace `url` request parameters to the request URL
const addUrlParams = function({ path, rawRequest }) {
  const pathA = path.replace(URL_PARAM_REGEXP, (pathA, name) => getUrlParam({ name, rawRequest }))
  const pathB = escapePath({ path: pathA })
  return pathB
}

// Matches `url` request parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in `url` request parameter names
const URL_PARAM_REGEXP = /\{([^}]+)\}/g

const getUrlParam = function({ name, rawRequest }) {
  const property = `url.${name}`
  const value = rawRequest[property]

  if (value === undefined) {
    throwTaskError(`The URL parameter '${name}' must be defined`, { property })
  }

  return value
}

// According to RFC 3986, all characters should be escaped in paths except:
//   [:alnum:]-.+_~!$&'()*,;=:@/
// However `encodeURI()` does not escape # and ? so we escape them
const escapePath = function({ path }) {
  return encodeURI(path)
    .replace(/#/g, '%23')
    .replace(/\?/g, '%3F')
}

module.exports = {
  addUrlParams,
}
