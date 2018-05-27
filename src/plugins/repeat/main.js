'use strict'

const { repeatTasks } = require('./start')

module.exports = {
  name: 'repeat',
  start: repeatTasks,
  dependencies: ['config', 'tasks'],
}
