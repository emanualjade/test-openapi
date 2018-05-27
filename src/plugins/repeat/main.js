'use strict'

const { repeatTasks } = require('./start')

module.exports = {
  start: repeatTasks,
  dependencies: ['config', 'tasks'],
}
