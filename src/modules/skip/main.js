'use strict'

const { setSkippedTasks } = require('./start')
const { skipTask } = require('./complete')
const config = require('./config')

module.exports = {
  name: 'skip',
  dependencies: [],
  config,
  returnValue: true,
  handlers: [
    {
      type: 'start',
      handler: setSkippedTasks,
      order: 1150,
    },
    {
      type: 'task',
      handler: skipTask,
      order: 900,
    },
  ],
}
