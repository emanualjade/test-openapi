'use strict'

const { stringifyParams, parseResponse } = require('./task')

module.exports = {
  name: 'format',
  handlers: [
    {
      type: 'task',
      handler: stringifyParams,
      order: 1500,
    },
    {
      type: 'task',
      handler: parseResponse,
      order: 1800,
    },
  ],
}
