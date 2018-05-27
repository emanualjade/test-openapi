'use strict'

const { handleDryRun } = require('./start')

module.exports = {
  name: 'dry',
  dependencies: [],
  handlers: [
    {
      type: 'start',
      handler: handleDryRun,
      order: 150,
    },
  ],
}
