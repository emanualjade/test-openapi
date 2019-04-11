import { env } from 'process'

import { mapValues } from 'lodash'

import { parseFlat } from '../../../utils/flat.js'

// `$$env.envVarName` template function
// Replaced by `process.env.envVarName`
const getEnv = function() {
  // Allow environment variables to be integers, booleans, etc.
  return mapValues(env, parseFlat)
}

// eslint-disable-next-line id-match
export const $$env = getEnv()
