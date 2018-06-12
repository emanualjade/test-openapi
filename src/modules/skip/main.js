'use strict'

const { start } = require('./start')
const { task } = require('./task')
const config = require('./config')

module.exports = {
  config,
  returnValue: true,
  start,
  task,
}
