'use strict'

const { addFullUrl } = require('./task')

module.exports = {
  name: 'url',
  dependencies: ['request'],
  handlers: [
    {
      type: 'task',
      handler: addFullUrl,
      order: 140,
    },
  ],
}
