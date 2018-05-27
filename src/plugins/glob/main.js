'use strict'

const { mergeGlobTasks } = require('./start')

module.exports = {
  name: 'glob',
  start: mergeGlobTasks,
  dependencies: ['tasks'],
}
