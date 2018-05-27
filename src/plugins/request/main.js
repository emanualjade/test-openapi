'use strict'

const { normalizeParams } = require('./start')
const { sendRequest, getReturnValue } = require('./task')

module.exports = {
  name: 'request',
  start: normalizeParams,
  task: [sendRequest, getReturnValue],
  dependencies: ['config', 'tasks', 'format', 'url'],
  returnedProperties: ['request', 'response'],
}
