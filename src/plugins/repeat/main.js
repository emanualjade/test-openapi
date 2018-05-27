'use strict'

const { repeatTasks } = require('./start')

module.exports = {
  name: 'repeat',
  dependencies: [],
  defaults: {
    general: 10,
  },
  handlers: [
    {
      type: 'start',
      handler: repeatTasks,
      order: 1600,
    },
  ],
}
