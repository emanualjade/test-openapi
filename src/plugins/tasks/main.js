'use strict'

const { getTasks } = require('./start')

module.exports = {
  name: 'tasks',
  start: getTasks,
  dependencies: ['config'],
}
