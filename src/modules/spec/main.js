'use strict'

const { loadOpenApiSpec, loadNormalizedSpec } = require('./start')
const { addSpecToTask } = require('./task')
const config = require('./config')

module.exports = {
  name: 'spec',
  dependencies: ['call'],
  optionalDependencies: ['random', 'validate'],
  config,
  handlers: [
    {
      type: 'start',
      handler: loadNormalizedSpec,
      order: 1600,
    },
    {
      type: 'task',
      handler: addSpecToTask,
      order: 1150,
    },
  ],
  loadOpenApiSpec,
}
