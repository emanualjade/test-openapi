'use strict'

const { validateResponse } = require('./task')
const config = require('./config')

module.exports = {
  name: 'validate',
  dependencies: ['call'],
  config,
  handlers: [
    {
      type: 'task',
      handler: validateResponse,
      order: 1900,
    },
  ],
}
