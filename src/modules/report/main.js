'use strict'

const { start } = require('./start')
const { complete } = require('./complete')
const { end } = require('./end')
const config = require('./config')

module.exports = {
  name: 'report',
  dependencies: [],
  config,
  handlers: [
    {
      type: 'start',
      handler: start,
      order: 1400,
    },
    {
      type: 'complete',
      handler: complete,
      order: 1000,
    },
    {
      type: 'end',
      handler: end,
      order: 1000,
    },
  ],
}
