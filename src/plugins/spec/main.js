'use strict'

const { loadOpenApiSpec } = require('./load')
const { loadNormalizedSpec } = require('./normalize')
const { mergeSpecParams, mergeSpecValidate } = require('./merge')

module.exports = {
  loadOpenApiSpec,
  start: loadNormalizedSpec,
  task: [mergeSpecParams, mergeSpecValidate],
  dependencies: ['config', 'tasks', 'request', 'generate', 'validate'],
}
