'use strict'

const { task } = require('./task')
const config = require('./config')

module.exports = {
  name: 'validate',
  config,
  task,
}
