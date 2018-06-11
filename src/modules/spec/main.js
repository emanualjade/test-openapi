'use strict'

const { loadOpenApiSpec, loadNormalizedSpec } = require('./start')
const { addSpecToTask } = require('./task')
const config = require('./config')

module.exports = {
  name: 'spec',
  config,
  handlers: [
    {
      type: 'start',
      handler: loadNormalizedSpec,
      order: 1300,
    },
    {
      type: 'task',
      handler: addSpecToTask,
      order: 1300,
    },
  ],
  loadOpenApiSpec,
}
