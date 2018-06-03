'use strict'

const { startTap } = require('./start')
const { endTap } = require('./end')
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
    {
      type: 'end',
      handler: endTap,
      order: 1000,
    },
  ],
}
