'use strict'

// Add `task.call.server`
// It can only be validated after URL variables have been replaced
const getServer = function({ rawRequest, config, helpers }) {
  const server = getServerValue({ rawRequest, config, helpers })
  return server.replace(TRAILING_SLASH_REGEXP, '')
}

const getServerValue = function({ rawRequest, config: { call = {} }, helpers }) {
  return rawRequest.server || call.server || getDefaultServer({ helpers })
}

const getDefaultServer = function({ helpers }) {
  const hostname = getHostname({ helpers })
  const port = getPort({ helpers })
  const server = `http://${hostname}${port}`
  return server
}

// Defaults to environment variable HOST or to `localhost`
const getHostname = function({ helpers }) {
  return helpers('$$env.HOST') || DEFAULT_HOSTNAME
}

const DEFAULT_HOSTNAME = 'localhost'

// Defaults to environment variable PORT or the protocol's default port
const getPort = function({ helpers }) {
  const port = helpers('$$env.PORT')

  if (port) {
    return `:${port}`
  }

  return ''
}

// Remove trailing slashes in base URL
const TRAILING_SLASH_REGEXP = /\/$/

module.exports = {
  getServer,
}
