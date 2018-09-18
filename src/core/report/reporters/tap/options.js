'use strict'

const { green, red, gray, yellow } = require('../../utils')

const serializer = require('./serializer')

// Set TAP state
const options = function({ _tasks: tasks }) {
  const count = tasks.length
  const tap = serializer.init({ count, colors: THEME })
  return { tap }
}

const THEME = {
  pass: green,
  fail: red,
  comment: gray,
  skip: gray,
  version: gray,
  plan: gray,
  final: yellow,
}

module.exports = {
  options,
}
