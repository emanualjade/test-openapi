'use strict'

const { normalizeGenerate } = require('./start')
const { generateParams } = require('./task')

module.exports = {
  name: 'generate',
  dependencies: ['call'],
  handlers: [
    {
      type: 'start',
      handler: normalizeGenerate,
      order: 1400,
    },
    {
      type: 'task',
      handler: generateParams,
      order: 1200,
    },
  ],
}
