'use strict'

const { mergeAll } = require('lodash/fp')

const { hasOptionalDependency } = require('../../../utils')

const { getSpecOperation } = require('./operation')
const { removeOptionals } = require('./optional')

// Add OpenAPI specification parameters to `task.random.*`
const addSpecToRandom = function({ spec, key, random, call, plugins }) {
  if (!hasOptionalDependency({ plugins, name: 'random' })) {
    return
  }

  const specOperation = getSpecOperation({ key, spec })

  // Task does not start with an `operationId`
  if (specOperation === undefined) {
    return random
  }

  const { params } = specOperation

  const paramsA = removeOptionals({ params, random, call })

  // Specification params have less priority than `task.random.*`
  const randomA = mergeAll([paramsA, random])
  return randomA
}

module.exports = {
  addSpecToRandom,
}
