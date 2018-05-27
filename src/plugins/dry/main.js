'use strict'

const { handleDryRun } = require('./start')

module.exports = {
  name: 'dry',
  start: handleDryRun,
  dependencies: ['config', 'tasks'],
}
