'use strict'

const { normalizeValidate } = require('./start')
const { validateResponse } = require('./task')
const config = require('./config')
const { returnValue } = require('./return')

module.exports = {
  name: 'validate',
  dependencies: ['call'],
  config,
  returnValue,
  handlers: [
    {
      type: 'start',
      handler: normalizeValidate,
      order: 1500,
    },
    {
      type: 'task',
      handler: validateResponse,
      order: 1700,
    },
  ],
}
