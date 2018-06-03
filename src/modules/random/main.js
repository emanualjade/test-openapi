'use strict'

const { addRandomParams } = require('./start')
const { generateParams } = require('./task')
const config = require('./config')

module.exports = {
  name: 'random',
  dependencies: ['call'],
  config,
  handlers: [
    {
      type: 'start',
      handler: addRandomParams,
      order: 1200,
    },
    {
      type: 'task',
      handler: generateParams,
      order: 1200,
    },
  ],
}
