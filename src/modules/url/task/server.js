'use strict'

const { env } = require('process')

// Add `task.call.server`
// It can only be validated after URL variables have been replaced
const getServer = function({ rawRequest: { server = getDefaultServer() } }) {
  return server.replace(TRAILING_SLASH_REGEXP, '')
}

const getDefaultServer = function() {
  const hostname = getHostname()
  const port = getPort()
  const server = `http://${hostname}${port}`
  return server
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

// Remove trailing slashes in base URL
const TRAILING_SLASH_REGEXP = /\/$/

module.exports = {
  getServer,
}
