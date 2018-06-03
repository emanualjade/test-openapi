'use strict'

const { normalizeParams } = require('./start')
const { fireHttpCall } = require('./task')
const { config } = require('./config.js')

module.exports = {
  name: 'call',
  dependencies: ['format', 'url'],
  config,
  handlers: [
    {
      type: 'start',
      handler: normalizeParams,
      order: 1100,
    },
    {
      type: 'task',
      handler: fireHttpCall,
      order: 1500,
    },
  ],
}
