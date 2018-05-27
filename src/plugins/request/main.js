'use strict'

const { normalizeParams } = require('./normalize')
const { sendRequest } = require('./send')
const { getReturnValue } = require('./return')

module.exports = {
  start: normalizeParams,
  task: sendRequest,
  taskTwo: getReturnValue,
  dependencies: ['config', 'tasks', 'format', 'url'],
  returnedProperties: ['request', 'response'],
}
