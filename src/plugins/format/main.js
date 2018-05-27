'use strict'

const { stringifyParams, parseResponse } = require('./task')

module.exports = {
  name: 'format',
  handlers: [
    {
      type: 'task',
      handler: stringifyParams,
      order: 130,
    },
    {
      type: 'task',
      handler: parseResponse,
      order: 160,
    },
  ],
  dependencies: ['request', 'validate'],
}
