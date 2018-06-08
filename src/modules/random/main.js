'use strict'

const { addRandomParams } = require('./start')
const { generateParams } = require('./task')
const config = require('./config')

module.exports = {
  name: 'random',
  dependencies: ['call'],
  config,
  returnValue: false,
  handlers: [
    {
      type: 'start',
      handler: addRandomParams,
      order: 1300,
    },
    {
      type: 'task',
      handler: generateParams,
      order: 1100,
    },
  ],
}
