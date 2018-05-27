'use strict'

const { stringifyParams, parseResponse } = require('./task')

module.exports = {
  task: [stringifyParams, parseResponse],
  dependencies: ['tasks', 'request', 'validate'],
}
