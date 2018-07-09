'use strict'

const { env } = require('process')

const { parseFlat } = require('../../utils')

// `$$env.envVarName` helper
// Replaced by `process.env.envVarName`
const getEnvHelper = function() {
  // We use a proxy (instead of a reference to `process.env` to add some logic:
  //  - case-insensitive names
  //  - value parsing
  return new Proxy({}, { get: getEnvVar })
}

const getEnvVar = function(proxy, envVarName) {
  const envVar = findEnvVar({ envVarName })
  if (envVar === undefined) {
    return
  }

  // Allow environment variables to be integers, booleans, etc.
  const envVarA = parseFlat(envVar)
  return envVarA
}

const findEnvVar = function({ envVarName }) {
  if (env[envVarName] !== undefined) {
    return env[envVarName]
  }

  // Try to match environment variable name case-insensitively
  const envVarNameA = envVarName.toLowerCase()
  const envVar = Object.entries(env).find(([key]) => key.toLowerCase() === envVarNameA)
  if (envVar === undefined) {
    return
  }

  return envVar[1]
}

const envHelper = getEnvHelper()

module.exports = {
  $$env: envHelper,
}
