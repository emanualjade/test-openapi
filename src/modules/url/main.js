'use strict'

const { addFullUrl } = require('./task')

module.exports = {
  name: 'url',
  dependencies: ['call'],
  handlers: [
    {
      type: 'task',
      handler: addFullUrl,
      order: 1400,
    },
  ],
}
