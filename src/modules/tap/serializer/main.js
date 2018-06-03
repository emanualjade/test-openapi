'use strict'

const { version } = require('./version')
const { plan } = require('./plan')
const { test } = require('./test')
const { assert } = require('./assert')
const { comment } = require('./comment')
const { end } = require('./end')
const { close } = require('./write')

// TAP serializer
class Tap {
  constructor({ output } = {}) {
    const index = 0

    Object.assign(this, { output, index })
  }
}

Object.assign(Tap.prototype, { close, version, plan, test, assert, comment, end })

module.exports = {
  Tap,
}
