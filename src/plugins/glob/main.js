'use strict'

const { mergeGlobTasks } = require('./start')

module.exports = {
  start: mergeGlobTasks,
  dependencies: ['tasks'],
}
