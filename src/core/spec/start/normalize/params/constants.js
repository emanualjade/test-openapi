'use strict'

const { TestOpenApiError } = require('../../../../../errors')

// Operation's method, server and path as a `task.call.method|server|path` parameter
const getConstants = function({ spec, method, path }) {
  const serverParam = getServerParam({ spec })
  const methodParam = getMethodParam({ method })
  const pathParam = getPathParam({ path })

  return { ...serverParam, ...methodParam, ...pathParam }
}

// Retrieve `task.call.server`
const getServerParam = function({ spec: { host: hostname, basePath } }) {
  // Only if OpenAPI `host` is defined
  if (hostname === undefined) {
    return
  }

  // TODO: support `spec.schemes` instead of always using HTTP
  const value = `http://${hostname}${basePath}`
  return getConstant({ value, key: 'server' })
}

// Retrieve `task.call.method`
const getMethodParam = function({ method }) {
  return getConstant({ value: method, key: 'method' })
}

// Retrieve `task.call.path`
const getPathParam = function({ path }) {
  const value = getExpressPath({ path })
  const pathParam = getConstant({ value, key: 'path' })
  return pathParam
}

// Transform an OpenAPI path `/path/{variable}` into an Express-style path `/path/:variable`
// Note that according to OpenAPI spec, path variables are always required.
const getExpressPath = function({ path }) {
  return path.replace(URL_PARAM_REGEXP, (match, name) => getExpressVariable({ name, path }))
}

// Matches `url` request parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in `url` request parameter names
const URL_PARAM_REGEXP = /\{([^}]+)\}/g

const getExpressVariable = function({ name, path }) {
  if (VALID_EXPRESS_PATH_NAME.test(name)) {
    return `:${name}`
  }

  throw new TestOpenApiError(
    `In OpenAPI 'path' '${path}', variable name '${name}' is invalid: it must only contain letters, digits and underscores`,
  )
}

// Valid path variable name according to `path-to-regexp` library.
// We are sligtly more restrictive as we disallow starting with a digit,
// to distinguish from URL port.
const VALID_EXPRESS_PATH_NAME = /^[a-zA-Z_]\w*$/

const getConstant = function({ value, key }) {
  return { [key]: { type: 'string', enum: [value] } }
}

module.exports = {
  getConstants,
}
