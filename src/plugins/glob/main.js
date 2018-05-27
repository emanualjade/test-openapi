'use strict'

const { mergeGlobTasks } = require('./start')

module.exports = {
  name: 'glob',
  handlers: [
    {
      type: 'start',
      handler: mergeGlobTasks,
      order: 100,
    },
  ],
  dependencies: [],
}
