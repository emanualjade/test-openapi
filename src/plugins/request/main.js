'use strict'

const { normalizeParams } = require('./normalize')
const { sendRequest } = require('./send')

module.exports = {
  normalizeParams,
  sendRequest,
  returnedProperties: ['request', 'response'],
}
