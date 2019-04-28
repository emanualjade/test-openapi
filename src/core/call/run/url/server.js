import { env } from 'process'

const { HOST, PORT } = env

// Add `task.call.server`
// It can only be validated after URL variables have been replaced
export const getServer = function({ rawRequest }) {
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
  const server = `http://${hostname}${port}`
  return server
}

// Defaults to environment variable HOST or to `localhost`
const getHostname = function() {
  return HOST || DEFAULT_HOSTNAME
}

const DEFAULT_HOSTNAME = 'localhost'

// Defaults to environment variable PORT or the protocol's default port
const getPort = function() {
  if (PORT) {
    return `:${PORT}`
  }

  return ''
}

// Remove trailing slashes in base URL
const TRAILING_SLASH_REGEXP = /\/$/u
