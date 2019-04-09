const { getDirective } = require('./directive')
const { checkArgument } = require('./check')

// TAP plan
const plan = function({ count }) {
  if (count === undefined) {
    return ''
  }

  checkArgument(count, 'integer')

  const planString = getPlanString({ count })

  return `${planString}\n\n`
}

const getPlanString = function({ count }) {
  const planString = getPlan({ count })

  const directiveString = getPlanDirective({ count })

  return `${planString}${directiveString}`
}

const getPlan = function({ count }) {
  if (count === 0) {
    // Needed notation for `tap-parser` to parse it correctly
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
