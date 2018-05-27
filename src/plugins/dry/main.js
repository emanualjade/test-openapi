'use strict'

const { handleDryRun } = require('./start')

module.exports = {
  name: 'dry',
  dependencies: [],
  defaults: {
    general: false,
  },
  handlers: [
    {
      type: 'start',
      handler: handleDryRun,
      order: 150,
    },
  ],
}
