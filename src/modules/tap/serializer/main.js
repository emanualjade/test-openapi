'use strict'

const { version } = require('./version')
const { plan } = require('./plan')
const { test } = require('./test')
const { assert } = require('./assert')
const { comment } = require('./comment')
const { end } = require('./end')
const { getKeysCount } = require('./keys')

// TAP serializer
class Tap {
  constructor({ output, count, keys } = {}) {
    const index = 0
    const pass = 0
    const fail = 0
    const skip = 0
    const asserts = {}

    const { count: countA, keys: keysA } = getKeysCount({ count, keys })

    Object.assign(this, { output, index, pass, fail, skip, count: countA, keys: keysA, asserts })

    version(this)

    if (countA !== undefined) {
      plan(this, countA)
    }
  }
}

Object.assign(Tap.prototype, { test, assert, comment, end })

module.exports = {
  Tap,
}
