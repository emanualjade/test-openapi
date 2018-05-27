'use strict'

const { repeatTasks } = require('./start')

module.exports = {
  name: 'repeat',
  handlers: [
    {
      type: 'start',
      handler: repeatTasks,
      order: 160,
    },
  ],
  dependencies: [],
}
