'use strict'

const { getDirective } = require('./directive')
const { write } = require('./write')
const { checkArgument } = require('./check')

// TAP plan
const plan = function(count, directive) {
  checkArgument(count, 'integer')

  const planString = getPlan({ count })

  const directiveA = getPlanDirective({ directive, count })
  const directiveString = getDirective({ planString, directive: directiveA })

  return write(this, `${planString}${directiveString}`)
}

const getPlan = function({ count }) {
  if (count === 0) {
    return '0..0'
  }

  return `1..${String(count)}`
}

// If no asserts are defined, consider plan as skipped
const getPlanDirective = function({ directive, count }) {
  if (directive === undefined && count === 0) {
    return { skip: true }
  }

  return directive
}

module.exports = {
  plan,
}
