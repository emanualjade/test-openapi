'use strict'

const { normalizeParams } = require('./start')
const { fireHttpCall } = require('./task')
const { config } = require('./config.js')
const { returnValue } = require('./return')
const { title, errorProps } = require('./report')

module.exports = {
  name: 'call',
  dependencies: ['format', 'url'],
  config,
  returnValue,
  report: {
    title,
    errorProps,
  },
  handlers: [
    {
      type: 'start',
      handler: normalizeParams,
      order: 1200,
    },
    {
      type: 'task',
      handler: fireHttpCall,
      order: 1400,
    },
  ],
}
