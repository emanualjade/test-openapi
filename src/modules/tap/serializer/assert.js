'use strict'

const { getDirective } = require('./directive')
const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP assert
const assert = function(ok, { directive } = {}) {
  checkArgument(ok, 'boolean')

  this.index = this.index + 1

  const okStr = getOk({ ok })

  const directiveString = getDirective({ directive })

  const assertString = `${okStr} ${this.index}${directiveString}`

  return write(this, assertString)
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
