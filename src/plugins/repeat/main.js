'use strict'

const { repeatTasks } = require('./start')
const config = require('./config')

module.exports = {
  name: 'repeat',
  dependencies: [],
  config,
  handlers: [
    {
      type: 'start',
      handler: repeatTasks,
      order: 1600,
    },
  ],
}
