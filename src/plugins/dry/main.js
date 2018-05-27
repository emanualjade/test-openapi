'use strict'

const { handleDryRun } = require('./start')
const conf = require('./conf')

module.exports = {
  name: 'dry',
  dependencies: [],
  conf,
  handlers: [
    {
      type: 'start',
      handler: handleDryRun,
      order: 1500,
    },
  ],
}
