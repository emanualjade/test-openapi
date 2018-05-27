'use strict'

const { stringifyParams } = require('./stringify')
const { parseResponse } = require('./parse')

module.exports = {
  stringifyParams,
  parseResponse,
  dependencies: ['tasks', 'request', 'validate'],
}
