'use strict'

const { getDirective } = require('./directive')
const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP plan
const plan = function(tap, count) {
  checkArgument(count, 'integer')

  const planString = getPlanString({ count })

  return write(tap, planString)
}

const getPlanString = function({ count }) {
  const planString = getPlan({ count })

  const directiveString = getPlanDirective({ count })

  return `${planString}${directiveString}`
}

const getPlan = function({ count }) {
  if (count === 0) {
    return '1..0'
  }

  return `1..${String(count)}`
}

// If no asserts are defined, consider plan as skipped
const getPlanDirective = function({ count }) {
  if (count !== 0) {
    return ''
  }

  const directive = { skip: true }
  const directiveString = getDirective({ directive })
  return directiveString
}

module.exports = {
  plan,
  getPlanString,
}
