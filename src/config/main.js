'use strict'

const { omitBy } = require('lodash')

const { TestOpenApiError } = require('../errors')
const { getPath } = require('../utils')
const { parseInput } = require('../tasks')

const { validateConfig } = require('./validate')
const DEFAULT_CONFIG = require('./defaults')

// Load and normalize configuration
const loadConfig = function({ config }) {
  const configA = omitBy(config, value => value === undefined)

  validateConfig({ config: configA })

  const configB = parseInput(configA, throwParseError)

  // Apply default values
  const configC = { ...DEFAULT_CONFIG, ...configB }

  return configC
}

const throwParseError = function({ message, value, path }) {
  const property = getPath(['config', ...path])
  throw new TestOpenApiError(`Configuration ${message}`, { value, property })
}

module.exports = {
  loadConfig,
}
