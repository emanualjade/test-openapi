'use strict'

const { startTap } = require('./start')
const config = require('./config')

module.exports = {
  name: 'tap',
  dependencies: [],
  config,
  handlers: [
    {
      type: 'start',
      handler: startTap,
      order: 1600,
    },
  ],
}
