'use strict'

const { handleDryRun } = require('./start')

module.exports = {
  start: handleDryRun,
  dependencies: ['config', 'tasks'],
}
