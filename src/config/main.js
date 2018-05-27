'use strict'

const { validateConfig } = require('./validate')
const DEFAULT_CONFIG = require('./defaults')

// Load and normalize configuration
const loadConfig = function({ config }) {
  validateConfig({ config })

  // Apply default values
  const configB = { ...DEFAULT_CONFIG, ...config }

  return configB
}

module.exports = {
  loadConfig,
}
