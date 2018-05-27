'use strict'

const { stringifyParams } = require('./stringify')
const { parseResponse } = require('./parse')

module.exports = {
  task: stringifyParams,
  taskTwo: parseResponse,
  dependencies: ['tasks', 'request', 'validate'],
}
