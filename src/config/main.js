'use strict'

const { omitBy } = require('lodash')

const { validateConfig } = require('./validate')
const DEFAULT_CONFIG = require('./defaults')

// Load and normalize configuration
const loadConfig = function({ config }) {
  validateConfig({ config })

  const configA = omitBy(config, value => value === undefined)

  // Apply default values
  const configB = { ...DEFAULT_CONFIG, ...configA }

  return configB
}

module.exports = {
  loadConfig,
}
