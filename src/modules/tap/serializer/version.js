'use strict'

const { write } = require('./write')

// TAP version
const version = function(tap) {
  return write(tap, 'TAP version 13')
}

module.exports = {
  version,
}
