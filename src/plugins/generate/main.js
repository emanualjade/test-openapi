'use strict'

const { normalizeGenerate } = require('./start')
const { generateParams } = require('./task')

module.exports = {
  start: normalizeGenerate,
  task: generateParams,
  dependencies: ['tasks', 'request'],
}
