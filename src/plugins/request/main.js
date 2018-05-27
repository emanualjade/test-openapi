'use strict'

const { normalizeParams } = require('./start')
const { sendRequest } = require('./task')

module.exports = {
  name: 'request',
  dependencies: ['format', 'url'],
  defaults: {
    general: {
      timeout: 1e4,
    },
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
  ],
}
