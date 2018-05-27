'use strict'

const { getTasks } = require('./start')

module.exports = {
  start: getTasks,
  dependencies: ['config'],
}
