'use strict'

const { normalizeValidate } = require('./normalize')
const { validateResponse } = require('./check')

module.exports = {
  start: normalizeValidate,
  task: validateResponse,
  dependencies: ['tasks', 'request'],
}
