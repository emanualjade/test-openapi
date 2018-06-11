'use strict'

const { start, loadOpenApiSpec } = require('./start')
const { task } = require('./task')
const config = require('./config')

module.exports = {
  name: 'spec',
  config,
  start,
  task,
  loadOpenApiSpec,
}
