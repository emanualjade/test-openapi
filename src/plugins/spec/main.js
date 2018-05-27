'use strict'

const { loadOpenApiSpec, loadNormalizedSpec } = require('./start')
const { mergeSpecParams, mergeSpecValidate } = require('./task')

module.exports = {
  name: 'spec',
  dependencies: ['call', 'generate', 'validate'],
  handlers: [
    {
      type: 'start',
      handler: loadNormalizedSpec,
      order: 130,
    },
    {
      type: 'task',
      handler: mergeSpecParams,
      order: 110,
    },
    {
      type: 'task',
      handler: mergeSpecValidate,
      order: 170,
    },
  ],
  loadOpenApiSpec,
}
