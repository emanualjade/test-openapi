'use strict'

const { env } = require('process')

const { normalizeUrl } = require('../utils')

// Returns API base URL
const getServer = function({ server, spec }) {
  const url = getUrl({ server, spec })
  const serverA = normalizeServerUrl({ url })
  return serverA
}

const getUrl = function({ server, spec: { url: specUrl } }) {
  return server || specUrl || getDefUrl()
}

const getDefUrl = function() {
  const hostname = getHostname()
  const port = getPort()
  const defUrl = `http://${hostname}${port}`
  return defUrl
}

// Defaults to environment variable HOST or to `localhost`
const getHostname = function() {
  return getEnv('host') || DEFAULT_HOSTNAME
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

const getEnv = function(name) {
  return env[name] || env[name.toUpperCase()] || env[name.toLowerCase()]
}

const normalizeServerUrl = function({ url }) {
  const urlA = normalizeUrl({ url })
  const urlB = urlA.replace(TRAILING_SLASH_REGEXP, '')
  return urlB
}

// Remove trailing slashes in base URL
const TRAILING_SLASH_REGEXP = /\/$/

module.exports = {
  getServer,
}
