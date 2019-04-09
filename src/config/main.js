import { omitBy } from 'lodash'

import { TestOpenApiError } from '../errors.js'
import { getPath } from '../utils.js'
import { parseInput } from '../serialize.js'

import { validateConfig } from './validate.js'
import DEFAULT_CONFIG from './defaults.js'

// Load and normalize configuration
export const loadConfig = function({ config }) {
  validateConfig({ config })

  const configA = parseInput(config, throwParseError)

  // Apply default values
  const configB = omitBy(configA, value => value === undefined)
  const configC = { ...DEFAULT_CONFIG, ...configB }

  return configC
}

// Validate configuration is JSON and turn `undefined` strings into
// actual `undefined`
const throwParseError = function({ message, value, path }) {
  const property = getPath(['config', ...path])
  throw new TestOpenApiError(`Configuration ${message}`, { value, property })
}
