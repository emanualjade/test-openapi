'use strict'

const { normalizeValidate } = require('./start')
const { validateResponse } = require('./task')

module.exports = {
  name: 'validate',
  dependencies: ['call'],
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
