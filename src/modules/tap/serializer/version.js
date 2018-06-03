'use strict'

const { write } = require('./write')

// TAP version
const version = function() {
  return write(this, 'TAP version 13')
}

module.exports = {
  version,
}
