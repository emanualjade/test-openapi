'use strict'

const { getDirective } = require('./directive')
const { getErrorProps } = require('./error_props')
const { checkArgument } = require('./check')

// TAP assert
const assert = function({ ok, name = '', directive = {}, error }) {
  const index = updateState.call(this, { ok, directive })

  const okString = getOk({ ok })

  const nameString = getName({ name })

  const directiveString = getDirective({ directive })

  const errorProps = getErrorProps({ ok, error })

  const color = COLORS[ok]
  return this.colors[color](`${okString} ${index}${nameString}${directiveString}${errorProps}\n\n`)
}

// Update index|tests|pass|skip|fail counters
const updateState = function({ ok, directive }) {
  const category = getCategory({ ok, directive })
  this[category]++

  return ++this.index
}

const getCategory = function({ ok, directive: { skip } }) {
  if (skip !== undefined && skip !== false) {
    return 'skip'
  }

  if (ok) {
    return 'pass'
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

const COLORS = {
  true: 'green',
  false: 'red',
}

module.exports = {
  assert,
}
