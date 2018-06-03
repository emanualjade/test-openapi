'use strict'

const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP assert
const assert = function(ok) {
  checkArgument(ok, 'boolean')

  this.index = this.index + 1

  const okStr = getOk({ ok })

  return write(this, `${okStr} ${this.index}`)
}

const getOk = function({ ok }) {
  if (ok) {
    return 'ok'
  }

  return 'not ok'
}

module.exports = {
  assert,
}
