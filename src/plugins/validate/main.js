'use strict'

const { normalizeValidate } = require('./start')
const { validateResponse } = require('./task')
const config = require('./config')

module.exports = {
  name: 'validate',
  dependencies: ['call'],
  config,
  handlers: [
    {
      type: 'start',
      handler: normalizeValidate,
      order: 1200,
    },
    {
      type: 'task',
      handler: validateResponse,
      order: 1800,
    },
  ],
}
