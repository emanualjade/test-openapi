'use strict'

const { repeatTasks } = require('./start')

module.exports = {
  name: 'repeat',
  dependencies: [],
  handlers: [
    {
      type: 'start',
      handler: repeatTasks,
      order: 160,
    },
  ],
}
