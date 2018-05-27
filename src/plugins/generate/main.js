'use strict'

const { normalizeGenerate } = require('./start')
const { generateParams } = require('./task')

module.exports = {
  name: 'generate',
  handlers: [
    {
      type: 'start',
      handler: normalizeGenerate,
      order: 140,
    },
    {
      type: 'task',
      handler: generateParams,
      order: 120,
    },
  ],
  dependencies: ['request'],
}
