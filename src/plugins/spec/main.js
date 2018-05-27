'use strict'

const { loadOpenApiSpec, loadNormalizedSpec } = require('./start')
const { mergeSpecParams, mergeSpecValidate } = require('./task')
const config = require('./config')

module.exports = {
  name: 'spec',
  dependencies: ['call', 'generate', 'validate'],
  config,
  handlers: [
    {
      type: 'start',
      handler: loadNormalizedSpec,
      order: 1300,
    },
    {
      type: 'task',
      handler: mergeSpecParams,
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
