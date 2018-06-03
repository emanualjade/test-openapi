'use strict'

const { start } = require('./start')
const { test } = require('./test')
const { assert } = require('./assert')
const { comment } = require('./comment')
const { end } = require('./end')

// TAP serializer
class Tap {
  constructor({ count } = {}) {
    Object.assign(this, { index: 0, pass: 0, fail: 0, skip: 0, count })
  }
}

Object.assign(Tap.prototype, { start, test, assert, comment, end })

module.exports = {
  Tap,
}
