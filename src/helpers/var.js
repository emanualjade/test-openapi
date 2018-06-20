'use strict'

const { get } = require('lodash')

const varHelper = function(path, { options }) {
  return get(options, path)
}

module.exports = varHelper
