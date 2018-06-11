'use strict'

// Operation's method, server and path as a `task.call.method|server|path` parameter
const getConstants = function({ spec, method, path, server }) {
  const serverParam = getServerParam({ spec, server })
  const methodParam = getConstant({ value: method, key: 'method' })
  const pathParam = getConstant({ value: path, key: 'path' })

  return { ...serverParam, ...methodParam, ...pathParam }
}

const getServerParam = function({ spec: { host: hostname, basePath }, server }) {
  // Only if OpenAPI `host` is defined
  // If `config.server` is defined, it is used instead
  if (hostname === undefined || server !== undefined) {
    return
  }

  // TODO: support `spec.schemes` instead of always using HTTP
  const value = `http://${hostname}${basePath}`
  return getConstant({ value, key: 'server' })
}

const getConstant = function({ value, key }) {
  return { [key]: { type: 'string', enum: [value] } }
}

module.exports = {
  getConstants,
}
