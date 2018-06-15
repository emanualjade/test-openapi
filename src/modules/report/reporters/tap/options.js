'use strict'

const { Tap } = require('./serializer')

// Set TAP state
const options = function({ config: { tasks } }) {
  const count = tasks.length
  const tap = new Tap({ count, colors: THEME })
  return { tap }
}

const THEME = {
  pass: 'green',
  fail: 'red',
  comment: 'gray',
  skip: 'gray',
  version: 'gray',
  plan: 'gray',
  final: 'yellow',
}

module.exports = {
  options,
}
