'use strict'

const { getDirective } = require('./directive')
const { getErrorProps } = require('./error_props')
const { checkArgument } = require('./check')

// TAP assert
const assert = function({ ok, name = '', directive = {}, error }) {
  const index = updateState(this, { ok, directive })

  const okString = getOk({ ok })

  const nameString = getName({ name })

  const directiveString = getDirective({ directive })

  const errorProps = getErrorProps({ ok, error })

  return `${okString} ${index}${nameString}${directiveString}${errorProps}\n\n`
}

// Update index|tests|pass|skip|fail counters
const updateState = function(tap, { ok, directive }) {
  const category = getCategory({ ok, directive })
  tap[category]++

  return ++tap.index
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
  checkArgument(ok, 'boolean')

  if (ok) {
    return 'ok'
  }

  return 'not ok'
}

const getName = function({ name }) {
  checkArgument(name, 'string')

  if (name === '') {
    return ''
  }

  return ` ${name}`
}

module.exports = {
  assert,
}
