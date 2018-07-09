'use strict'

const envHelper = require('../../../../helpers/core/env')

// Add `task.call.server`
// It can only be validated after URL variables have been replaced
const getServer = function({ rawRequest, config }) {
  const server = getServerValue({ rawRequest, config })
  return server.replace(TRAILING_SLASH_REGEXP, '')
}

const getServerValue = function({ rawRequest, config: { call = {} } }) {
  return rawRequest.server || call.server || getDefaultServer()
}

const getDefaultServer = function() {
  const hostname = getHostname()
  const port = getPort()
  const server = `http://${hostname}${port}`
  return server
}

// Defaults to environment variable HOST or to `localhost`
const getHostname = function() {
  return envHelper('host') || DEFAULT_HOSTNAME
}

const DEFAULT_HOSTNAME = 'localhost'

// Defaults to environment variable PORT or the protocol's default port
const getPort = function() {
  const port = envHelper('port')

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
