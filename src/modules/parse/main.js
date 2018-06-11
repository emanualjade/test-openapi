'use strict'

const { parseResponse } = require('./task')

module.exports = {
  name: 'parse',
  handlers: [
    {
      type: 'task',
      handler: parseResponse,
      order: 1800,
    },
  ],
}
