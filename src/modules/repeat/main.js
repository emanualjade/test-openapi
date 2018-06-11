'use strict'

const { repeatTasks } = require('./start')
const config = require('./config')

module.exports = {
  name: 'repeat',
  config,
  returnValue: true,
  handlers: [
    {
      type: 'start',
      handler: repeatTasks,
      order: 1500,
    },
  ],
}
