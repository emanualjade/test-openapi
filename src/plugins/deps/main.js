'use strict'

const { replaceDeps } = require('./replace')

module.exports = {
  task: replaceDeps,
  dependencies: ['config', 'tasks'],
}
