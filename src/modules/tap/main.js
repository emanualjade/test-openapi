'use strict'

const { startTap } = require('./start')
const { completeTap } = require('./complete')
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
      order: 1700,
    },
    {
      type: 'complete',
      handler: completeTap,
      order: 1000,
    },
    {
      type: 'end',
      handler: endTap,
      order: 1000,
    },
  ],
}
