'use strict'

const { checkOnlyRun } = require('./start')
const { selectOnlyTasks } = require('./task')
const config = require('./config')

module.exports = {
  name: 'only',
  config,
  returnValue: true,
  handlers: [
    {
      type: 'start',
      handler: checkOnlyRun,
      order: 1100,
    },
    {
      type: 'task',
      handler: selectOnlyTasks,
      order: 1000,
    },
  ],
}
