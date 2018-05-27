'use strict'

const { normalizeGenerate } = require('./start')
const { generateParams } = require('./task')

module.exports = {
  name: 'generate',
  start: normalizeGenerate,
  task: generateParams,
  dependencies: ['tasks', 'request'],
}
