'use strict'

const { TestOpenApiError } = require('../../../../../errors')

// Operation's method, server and path as a `task.call.method|server|path`
// parameter
const getConstants = function({ spec, operation, method, path }) {
  const serverParam = getServerParam({ spec, operation })
  const methodParam = getMethodParam({ method })
  const pathParam = getPathParam({ path })

  return { ...serverParam, ...methodParam, ...pathParam }
}

// Retrieve `task.call.server`
const getServerParam = function({
  spec: { schemes: specSchemes = DEFAULT_SCHEMES, host: hostname, basePath },
  operation: { schemes = specSchemes },
}) {
  // Only if OpenAPI `host` is defined
  if (hostname === undefined) {
    return
  }

  const servers = schemes.map(scheme => `${scheme}://${hostname}${basePath}`)
  return { server: { type: 'string', enum: servers } }
}

const DEFAULT_SCHEMES = ['http']

// Retrieve `task.call.method`
const getMethodParam = function({ method }) {
  return { method: { type: 'string', enum: [method] } }
}

// Retrieve `task.call.path`
const getPathParam = function({ path }) {
  const pathA = getExpressPath({ path })
  return { path: { type: 'string', enum: [pathA] } }
}

// Transform an OpenAPI path `/path/{variable}` into an Express-style path
// `/path/:variable`
// Note that according to OpenAPI spec, path variables are always required.
const getExpressPath = function({ path }) {
  return path.replace(URL_PARAM_REGEXP, (match, name) =>
    getExpressVariable({ name, path }),
  )
}

// Matches `url` request parameters, e.g. `/model/{id}`
// It's quite loose because the OpenAPI specification does not specify
// which characters are allowed in `url` request parameter names
const URL_PARAM_REGEXP = /\{([^}]+)\}/gu

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
const VALID_EXPRESS_PATH_NAME = /^[a-zA-Z_]\w*$/u

module.exports = {
  getConstants,
}
