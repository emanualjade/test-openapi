'use strict'

const { replaceDeps } = require('./task')

module.exports = {
  task: replaceDeps,
  dependencies: ['config', 'tasks'],
}
