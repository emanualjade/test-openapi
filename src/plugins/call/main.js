'use strict'

const { normalizeParams } = require('./start')
const { fireHttpCall } = require('./task')

module.exports = {
  name: 'call',
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
      handler: fireHttpCall,
      order: 150,
    },
  ],
}
