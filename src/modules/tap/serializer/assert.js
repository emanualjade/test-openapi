'use strict'

const { writeAssert } = require('./keys')
const { getDirective } = require('./directive')
const { getErrorProps } = require('./error_props')
const { checkArgument } = require('./check')

// TAP assert
const assert = function(assertOpts = {}) {
  const assertString = getAssert(this, assertOpts)
  return writeAssert(this, assertString, assertOpts.key)
}

const getAssert = function(tap, { key, ok, name = '', directive = {}, error }) {
  checkArgument(ok, 'boolean')
  checkArgument(name, 'string')

  updateState(tap, { ok, directive })

  const okString = getOk({ ok })

  const index = getIndex({ tap, key })

  const nameString = getName({ name })

  const directiveString = getDirective({ directive })

  const errorProps = getErrorProps({ ok, error })

  return `${okString} ${index}${nameString}${directiveString}${errorProps}`
}

const getIndex = function({ tap, tap: { keys }, key }) {
  if (keys !== undefined) {
    return keys.indexOf(key) + 1
  }

  return ++tap.index
}

// Update index|tests|pass|skip|fail counters
const updateState = function(tap, { ok, directive }) {
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
