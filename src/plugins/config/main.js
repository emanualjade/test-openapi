'use strict'

const { loadConfig } = require('./start')

module.exports = {
  name: 'config',
  start: loadConfig,
  dependencies: [],
}
