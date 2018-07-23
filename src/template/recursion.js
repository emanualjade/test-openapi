'use strict'

const { isEqual } = require('lodash')

const { TestOpenApiError } = require('../errors')

// Since templates can return other templates which then get evaluated, we need
// to check for infinite recursions.
const checkRecursion = function({ template, opts, opts: { stack = [] } }) {
  const hasRecursion = stack.some(templateA => isEqual(template, templateA))

  const stackA = [...stack, template]

  if (!hasRecursion) {
    return { ...opts, stack: stackA }
  }

  const recursion = printRecursion({ stack: stackA })
  throw new TestOpenApiError(`Infinite recursion:\n   ${recursion}`)
}

// Pretty printing of the recursion stack
const printRecursion = function({ stack }) {
  return stack.map(printTemplate).join(`\n ${RIGHT_ARROW} `)
}

const printTemplate = function({ type, name, arg }) {
  if (type === 'function') {
    return `${name}: ${JSON.stringify(arg)}`
  }

  return name
}

const RIGHT_ARROW = '\u21aa'

module.exports = {
  checkRecursion,
}
