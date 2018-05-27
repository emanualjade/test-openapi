'use strict'

const { handleDryRun } = require('./start')

module.exports = {
  name: 'dry',
  handlers: [
    {
      type: 'start',
      handler: handleDryRun,
      order: 150,
    },
  ],
  dependencies: [],
}
