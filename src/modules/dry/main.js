'use strict'

const { handleDryRun } = require('./start')
const config = require('./config')

module.exports = {
  name: 'dry',
  dependencies: [],
  config,
  handlers: [
    {
      type: 'start',
      handler: handleDryRun,
      order: 1500,
    },
  ],
}
