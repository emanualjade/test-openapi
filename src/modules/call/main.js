'use strict'

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
      type: 'task',
      handler: fireHttpCall,
      order: 1500,
    },
  ],
}
