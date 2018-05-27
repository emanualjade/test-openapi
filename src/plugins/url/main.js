'use strict'

const { addFullUrl } = require('./task')

module.exports = {
  name: 'url',
  handlers: [
    {
      type: 'task',
      handler: addFullUrl,
      order: 1140,
    },
  ],
  dependencies: ['request'],
}
