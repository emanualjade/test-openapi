'use strict'

const { stdout } = require('process')

const version = function(opts) {
  write('TAP version 13', opts)
}

const plan = function(integer, opts) {
  if (!Number.isInteger(integer)) {
    throw new Error(`tap.plan() argument must be an integer, not ${integer}`)
  }

  const planString = getPlan({ integer })
  write(planString, opts)
}

const getPlan = function({ integer }) {
  if (integer === 0) {
    return '0..0'
  }

  return `1..${integer}`
}

const write = function(string, { output = stdout } = {}) {
  output.write(`${string}\n`)
}

module.exports = {
  tap: {
    version,
    plan,
  },
}
