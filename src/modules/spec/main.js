'use strict'

const { loadOpenApiSpec, loadNormalizedSpec } = require('./start')
const { addSpecParams, mergeSpecValidate } = require('./task')
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
      order: 1400,
    },
    {
      type: 'task',
      handler: addSpecParams,
      order: 1100,
    },
    {
      type: 'task',
      handler: mergeSpecValidate,
      order: 1700,
    },
  ],
  loadOpenApiSpec,
}
