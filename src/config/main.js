import { omitBy } from 'lodash'

import { TestOpenApiError } from '../errors/error.js'
import { getPath } from '../utils/path.js'
import { parseInput } from '../serialize/input.js'

import { validateConfig } from './validate.js'

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

const DEFAULT_CONFIG = {
  tasks: ['**/*.tasks.yml', '**/*.tasks.json'],
  plugins: [],
}
