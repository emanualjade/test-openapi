'use strict'

const { loadOpenApiSpec } = require('./load')
const { loadNormalizedSpec } = require('./normalize')
const { mergeSpecParams, mergeSpecValidate } = require('./merge')

module.exports = {
  loadOpenApiSpec,
  loadNormalizedSpec,
  mergeSpecParams,
  mergeSpecValidate,
  dependencies: ['config', 'tasks', 'request', 'generate', 'validate'],
}
