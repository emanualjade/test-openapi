'use strict'

const { DEFAULT_STATUS_CODE } = require('../../../constants')

// Retrieve task's expected response HTTP status code
const getVStatus = function({ validate: { status = DEFAULT_STATUS_CODE } = {} }) {
  return status
}

module.exports = {
  getVStatus,
}
