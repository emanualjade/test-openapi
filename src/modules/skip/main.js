'use strict'

const { start } = require('./start')
const { task } = require('./task')
const config = require('./config')

module.exports = {
  name: 'skip',
  config,
  returnValue: true,
  start,
  task,
}
