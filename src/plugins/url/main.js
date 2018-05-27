'use strict'

const { addFullUrl } = require('./task')

module.exports = {
  name: 'url',
  handlers: [
    {
      type: 'task',
      handler: addFullUrl,
      order: 140,
    },
  ],
  dependencies: ['request'],
}
