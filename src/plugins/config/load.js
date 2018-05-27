'use strict'

const { omitBy } = require('lodash')

const { validateConfig } = require('./validate')
const DEFAULT_CONFIG = require('./defaults')

// Load and normalize configuration
const loadConfig = async function(config) {
  validateConfig({ config })

  const configA = cleanConfig({ config })

  // Apply default values
  const configB = { ...DEFAULT_CONFIG, ...configA }

  return configB
}

const cleanConfig = function({ config }) {
  const configA = omitBy(config, value => value === undefined)
  return { ...configA, originalConfig: configA }
}

module.exports = {
  loadConfig,
}
