const { env } = require('process')

const { mapValues } = require('lodash')

const { parseFlat } = require('../../../utils')

// `$$env.envVarName` template function
// Replaced by `process.env.envVarName`
const getEnv = function() {
  // Allow environment variables to be integers, booleans, etc.
  return mapValues(env, parseFlat)
}

const envTemplate = getEnv()

module.exports = {
  $$env: envTemplate,
}
