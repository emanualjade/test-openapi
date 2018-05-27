'use strict'

const { repeatTasks } = require('./handle')

module.exports = {
  start: repeatTasks,
  dependencies: ['config', 'tasks'],
}
