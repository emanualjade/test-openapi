'use strict'

const { normalizeGenerate } = require('./normalize')
const { generateParams } = require('./create')

module.exports = {
  start: normalizeGenerate,
  task: generateParams,
  dependencies: ['tasks', 'request'],
}
