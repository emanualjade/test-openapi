'use strict'

const { env } = require('process')

const { normalizeUrl } = require('../utils')

// Returns API base URL according to OpenAPI specification
const getBaseUrl = function({ endpoint, spec }) {
  const url = getUrl({ endpoint, spec })
  const baseUrl = normalizeBaseUrl({ url })
  return baseUrl
}

const getUrl = function({ endpoint, spec }) {
  if (endpoint) {
    return endpoint
  }

  const hostname = getHostname({ spec })
  const port = getPort()
  const basePath = getBasePath({ spec })
  // TODO: support `spec.schemes` instead of always using HTTP
  const url = `http://${hostname}${port}${basePath}`
  return url
}

// Defaults to the specification `host`, environment variable HOST or to `localhost`
const getHostname = function({ spec: { host } }) {
  return host || getEnv('host') || DEFAULT_HOSTNAME
}

const DEFAULT_HOSTNAME = 'localhost'

// Defaults to environment variable PORT or the protocol's default port
const getPort = function() {
  const port = getEnv('port')
  if (port) {
    return `:${port}`
  }

  return ''
}

// Defaults to the specification `basePath` or to `/`
const getBasePath = function({ spec: { basePath = DEFAULT_BASE_PATH } }) {
  return basePath
}

const DEFAULT_BASE_PATH = '/'

const getEnv = function(name) {
  return env[name] || env[name.toUpperCase()] || env[name.toLowerCase()]
}

const normalizeBaseUrl = function({ url }) {
  const baseUrl = normalizeUrl({ url })
  const baseUrlA = baseUrl.replace(TRAILING_SLASH_REGEXP, '')
  return baseUrlA
}

// Remove trailing slashes in base URL
const TRAILING_SLASH_REGEXP = /\/$/

module.exports = {
  getBaseUrl,
}
