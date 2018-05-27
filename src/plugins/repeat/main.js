'use strict'

const { repeatTasks } = require('./start')

module.exports = {
  name: 'repeat',
  dependencies: [],
  conf: {
    general: {
      schema: {
        type: 'integer',
        minimum: 1,
      },
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
