'use strict'

const { omit } = require('lodash')

const returnValue = function(validate) {
  return omit(validate, 'schemas')
}

module.exports = {
  returnValue,
}
