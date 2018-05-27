'use strict'

const { handleDryRun } = require('./handle')

module.exports = {
  start: handleDryRun,
  dependencies: ['config', 'tasks'],
}
