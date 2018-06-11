'use strict'

const { serializeParams } = require('./task')

module.exports = {
  name: 'serialize',
  handlers: [
    {
      type: 'task',
      handler: serializeParams,
      order: 1500,
    },
  ],
}
