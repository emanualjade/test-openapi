'use strict'

const { start } = require('./start')
const config = require('./config')

module.exports = {
  name: 'report',
  dependencies: ['tap'],
  config,
  handlers: [
    {
      type: 'start',
      handler: start,
      order: 1600,
    },
  ],
}
