'use strict'

const { mergeGlobTasks } = require('./merge')

module.exports = {
  start: mergeGlobTasks,
  dependencies: ['tasks'],
}
