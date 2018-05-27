'use strict'

const { normalizeValidate } = require('./start')
const { validateResponse } = require('./task')

module.exports = {
  name: 'validate',
  dependencies: ['request'],
  handlers: [
    {
      type: 'start',
      handler: normalizeValidate,
      order: 120,
    },
    {
      type: 'task',
      handler: validateResponse,
      order: 180,
    },
  ],
}
