'use strict'

const { omitBy, merge } = require('lodash')

const { validateConfig } = require('./validate')
const DEFAULT_CONFIG = require('./defaults')

// Load and normalize configuration
const loadConfig = function({ config }) {
  validateConfig({ config })

  const configA = omitBy(config, value => value === undefined)

  // TODO: fix
  const request = merge({}, DEFAULT_CONFIG.request, configA && configA.request)

  // Apply default values
  const configB = { ...DEFAULT_CONFIG, ...configA, request }

  return configB
}

module.exports = {
  loadConfig,
}
