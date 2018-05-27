'use strict'

const { mergeGlobTasks } = require('./start')

module.exports = {
  name: 'glob',
  dependencies: [],
  handlers: [
    {
      type: 'start',
      handler: mergeGlobTasks,
      order: 100,
    },
  ],
}
