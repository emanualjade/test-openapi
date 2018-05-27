'use strict'

const { normalizeParams } = require('./start')
const { sendRequest, getReturnValue } = require('./task')

module.exports = {
  name: 'request',
  dependencies: ['format', 'url'],
  properties: {
    success: ['request', 'response'],
    error: ['rawRequest', 'rawResponse'],
  },
  handlers: [
    {
      type: 'start',
      handler: normalizeParams,
      order: 110,
    },
    {
      type: 'task',
      handler: sendRequest,
      order: 150,
    },
    {
      type: 'task',
      handler: getReturnValue,
      order: 190,
    },
  ],
}
