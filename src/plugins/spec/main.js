'use strict'

const { loadOpenApiSpec, loadNormalizedSpec } = require('./start')
const { mergeSpecParams, mergeSpecValidate } = require('./task')

module.exports = {
  name: 'spec',
  handlers: [
    {
      type: 'start',
      handler: loadNormalizedSpec,
      order: 130,
    },
    {
      type: 'task',
      handler: mergeSpecParams,
      order: 1110,
    },
    {
      type: 'task',
      handler: mergeSpecValidate,
      order: 1170,
    },
  ],
  dependencies: ['request', 'generate', 'validate'],
  loadOpenApiSpec,
}
