'use strict'

const { getDirective } = require('./directive')
const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP assert
const assert = function(ok, { directive = {} } = {}) {
  checkArgument(ok, 'boolean')

  updateState(this, { ok, directive })

  const okStr = getOk({ ok })

  const directiveString = getDirective({ directive })

  const assertString = `${okStr} ${this.index}${directiveString}`

  return write(this, assertString)
}

// Update index|tests|pass|skip|fail counters
const updateState = function(tap, { ok, directive }) {
  tap.index++

  const category = getCategory({ ok, directive })
  tap[category]++
}

const getCategory = function({ ok, directive: { skip } }) {
  if (ok) {
    return 'pass'
  }

  if (skip !== undefined && skip !== false) {
    return 'skip'
  }

  return 'fail'
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
