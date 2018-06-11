'use strict'

const { replaceDeps } = require('./task')

module.exports = {
  name: 'deps',
  handlers: [
    {
      type: 'task',
      handler: replaceDeps,
      order: 1200,
    },
  ],
}
