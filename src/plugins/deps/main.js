'use strict'

const { replaceDeps } = require('./task')

module.exports = {
  name: 'deps',
  task: replaceDeps,
  dependencies: ['config', 'tasks'],
}
