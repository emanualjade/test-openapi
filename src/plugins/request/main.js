'use strict'

const { normalizeParams } = require('./normalize')
const { sendRequest } = require('./send')
const { getReturnValue } = require('./return')

module.exports = {
  normalizeParams,
  sendRequest,
  getReturnValue,
  returnedProperties: ['request', 'response'],
}
