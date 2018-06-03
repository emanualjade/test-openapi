'use strict'

const { omit } = require('lodash')

// Normalize `task.error.validate`
const error = function(taskConfig) {
  return omit(taskConfig, ['schemas'])
}

module.exports = {
  error,
}
