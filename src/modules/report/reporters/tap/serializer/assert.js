'use strict'

const { getDirective } = require('./directive')
const { getErrorProps } = require('./error_props')
const { checkArgument } = require('./check')

// TAP assert
const assert = function({ ok, name = '', directive = {}, error }) {
  const category = getCategory({ ok, directive })

  const index = updateState.call(this, { category })

  const okString = getOk({ ok })

  const nameString = getName({ name })

  const directiveString = getDirective({ directive })

  const errorProps = getErrorProps({ ok, error })

  const color = COLORS[category]
  return this.colors[color](`${okString} ${index}${nameString}${directiveString}${errorProps}\n\n`)
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

// Update index|tests|pass|skip|fail counters
const updateState = function({ category }) {
  this[category]++

  return ++this.index
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
  pass: 'green',
  fail: 'red',
  skip: 'grey',
}

module.exports = {
  assert,
}
