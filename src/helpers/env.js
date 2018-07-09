'use strict'

const { env } = require('process')

const { parseFlat } = require('../utils')

// `{ $env: 'envVarName' }` helper
// Replaced by `process.env.envVarName`
const envHelper = function(envVarName) {
  const envVar = getEnvVar({ envVarName })
  if (envVar === undefined) {
    return
  }

  // Allow environment variables to be integers, booleans, etc.
  const envVarA = parseFlat(envVar)
  return envVarA
}

const getEnvVar = function({ envVarName }) {
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

module.exports = {
  $$env: envHelper,
}
