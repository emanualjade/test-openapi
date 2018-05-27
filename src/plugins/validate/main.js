'use strict'

const { normalizeValidate } = require('./start')
const { validateResponse } = require('./task')

module.exports = {
  start: normalizeValidate,
  task: validateResponse,
  dependencies: ['tasks', 'request'],
}
