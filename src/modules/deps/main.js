'use strict'

const { replaceDeps } = require('./task')

module.exports = {
  name: 'deps',
  dependencies: [],
  handlers: [
    {
      type: 'task',
      handler: replaceDeps,
      order: 1100,
    },
  ],
}
