'use strict'

const { repeatTasks } = require('./start')

module.exports = {
  name: 'repeat',
  dependencies: [],
  conf: {
    general: {
      default: 10,
    },
  },
  handlers: [
    {
      type: 'start',
      handler: repeatTasks,
      order: 1600,
    },
  ],
}
