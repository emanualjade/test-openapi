'use strict'

const { normalizeParams } = require('./start')
const { fireHttpCall } = require('./task')
const conf = require('./conf')

module.exports = {
  name: 'call',
  dependencies: ['format', 'url'],
  conf,
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
