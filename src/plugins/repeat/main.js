'use strict'

const { repeatTasks } = require('./start')
const conf = require('./conf')

module.exports = {
  name: 'repeat',
  dependencies: [],
  conf,
  handlers: [
    {
      type: 'start',
      handler: repeatTasks,
      order: 1600,
    },
  ],
}
