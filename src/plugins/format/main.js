'use strict'

const { stringifyParams, parseResponse } = require('./task')

module.exports = {
  name: 'format',
  task: [stringifyParams, parseResponse],
  dependencies: ['tasks', 'request', 'validate'],
}
