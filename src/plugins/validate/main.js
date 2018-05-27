'use strict'

const { normalizeValidate } = require('./normalize')
const { validateResponse } = require('./check')

module.exports = {
  normalizeValidate,
  validateResponse,
  dependencies: ['tasks', 'request'],
}
