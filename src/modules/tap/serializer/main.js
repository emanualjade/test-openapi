'use strict'

const { version } = require('./version')
const { plan } = require('./plan')
const { test } = require('./test')
const { assert } = require('./assert')
const { comment } = require('./comment')
const { end } = require('./end')

// TAP serializer
class Tap {
  constructor({ output } = {}) {
    const index = 0
    const pass = 0
    const fail = 0
    const skip = 0

    Object.assign(this, { output, index, pass, fail, skip })
  }
}

Object.assign(Tap.prototype, { version, plan, test, assert, comment, end })

module.exports = {
  Tap,
}
