'use strict'

const { setDryRun } = require('./start')
const { skipTask } = require('./task')
const config = require('./config')

module.exports = {
  name: 'skip',
  dependencies: [],
  optionalDependencies: ['report'],
  config,
  returnValue: true,
  handlers: [
    {
      type: 'start',
      handler: setDryRun,
      order: 1200,
    },
    {
      type: 'task',
      handler: skipTask,
      order: 1100,
    },
  ],
}
