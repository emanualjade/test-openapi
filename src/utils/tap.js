'use strict'

const { stdout } = require('process')

const version = function(opts) {
  write('TAP version 13', opts)
}

const write = function(string, { output = stdout } = {}) {
  output.write(`${string}\n`)
}

module.exports = {
  tap: {
    version,
  },
}
