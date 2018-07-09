'use strict'

const { isEqual } = require('lodash')

const { TestOpenApiError } = require('../errors')

// Since helpers can return other helpers which then get evaluated, we need
// to check for infinite recursions.
const checkRecursion = function({ helper, info, info: { stack = [] } }) {
  const hasRecursion = stack.some(helperA => isEqual(helper, helperA))

  const stackA = [...stack, helper]

  if (!hasRecursion) {
    return { ...info, stack: stackA }
  }

  const recursion = printRecursion({ stack: stackA })
  throw new TestOpenApiError(`Infinite recursion:\n   ${recursion}`)
}

// Pretty printing of the recursion stack
const printRecursion = function({ stack }) {
  return stack.map(printHelper).join(`\n ${RIGHT_ARROW} `)
}

const printHelper = function({ type, name, arg }) {
  if (type === 'function') {
    return `${name}: ${JSON.stringify(arg)}`
  }

  return name
}

const RIGHT_ARROW = '\u21aa'

module.exports = {
  checkRecursion,
}
