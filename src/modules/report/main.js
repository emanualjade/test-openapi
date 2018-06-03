'use strict'

const { start } = require('./start')
const { end } = require('./end')
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
    {
      type: 'end',
      handler: end,
      order: 1100,
    },
  ],
}
