'use strict'

const { getDirective } = require('./directive')
const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP assert
const assert = function({ ok, name, directive } = {}) {
  const assertString = getAssert(this, { ok, name, directive })
  return write(this, assertString)
}

const getAssert = function(tap, { ok, name = '', directive = {} }) {
  checkArgument(ok, 'boolean')
  checkArgument(name, 'string')

  updateState(tap, { ok, directive })

  const okString = getOk({ ok })

  const nameString = getName({ name })

  const directiveString = getDirective({ directive })

  return `${okString} ${tap.index}${nameString}${directiveString}`
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

const getName = function({ name }) {
  if (name === '') {
    return ''
  }

  return ` ${name}`
}

module.exports = {
  assert,
  getAssert,
}
