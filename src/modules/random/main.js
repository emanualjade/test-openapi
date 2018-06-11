'use strict'

const { generateParams } = require('./task')
const config = require('./config')

module.exports = {
  name: 'random',
  config,
  returnValue: false,
  handlers: [
    {
      type: 'task',
      handler: generateParams,
      order: 1400,
    },
  ],
}
