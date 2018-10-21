'use strict'

const {
  template: { $$env },
} = require('../../../template')

// Add `task.call.server`
// It can only be validated after URL variables have been replaced
const getServer = function({ rawRequest }) {
  const server = getServerValue({ rawRequest })
  return server.replace(TRAILING_SLASH_REGEXP, '')
}

const getServerValue = function({ rawRequest: { server } }) {
  if (server !== undefined) {
    return server
  }

  return getDefaultServer()
}

const getDefaultServer = function() {
  const hostname = getHostname()
  const port = getPort()
  const scheme = getScheme()
  const server = `${scheme}://${hostname}${port}`
  return server
}

const DEFAULT_HOSTNAME = 'localhost'
const DEFAULT_SCHEME = 'http'

// Defaults to environment variable HTTP_SCHEME or to 'http'
const getScheme = function() {
  return $$env.SCHEME || DEFAULT_SCHEME
}

// Defaults to environment variable HOST or to `localhost`
const getHostname = function() {
  return $$env.HOST || DEFAULT_HOSTNAME
}

// Defaults to environment variable PORT or the protocol's default port
const getPort = function() {
  const port = $$env.PORT

  if (port) {
    return `:${port}`
  }

  return ''
}

// Remove trailing slashes in base URL
const TRAILING_SLASH_REGEXP = /\/$/u

module.exports = {
  getServer,
}
