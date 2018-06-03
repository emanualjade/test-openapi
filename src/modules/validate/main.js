'use strict'

const { normalizeValidate } = require('./start')
const { validateResponse } = require('./task')
const config = require('./config')
const { error } = require('./error')

module.exports = {
  name: 'validate',
  dependencies: ['call'],
  config,
  error,
  handlers: [
    {
      type: 'start',
      handler: normalizeValidate,
      order: 1300,
    },
    {
      type: 'task',
      handler: validateResponse,
      order: 1800,
    },
  ],
}
