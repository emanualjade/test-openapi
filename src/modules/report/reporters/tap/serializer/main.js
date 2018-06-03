'use strict'

const { getColors } = require('./colors')
const { start } = require('./start')
const { test } = require('./test')
const { assert } = require('./assert')
const { comment } = require('./comment')
const { end } = require('./end')

// TAP serializer
class Tap {
  constructor({ count, colors } = {}) {
    const colorsA = getColors({ colors })

    Object.assign(this, { index: 0, pass: 0, fail: 0, skip: 0, count, colors: colorsA })
  }
}

Object.assign(Tap.prototype, { start, test, assert, comment, end })

module.exports = {
  Tap,
}
