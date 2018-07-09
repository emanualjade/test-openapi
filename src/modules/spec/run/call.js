'use strict'

const { mergeAll } = require('lodash/fp')
const { mapValues } = require('lodash')

const { getSpecOperation } = require('./operation')
const { removeOptionals } = require('./optional')

// Add OpenAPI specification parameters to `task.call.*`
const addSpecToCall = function({ spec, key, call, helpers }) {
  const specOperation = getSpecOperation({ key, spec })

  // Task does not start with an `operationId`
  if (specOperation === undefined) {
    return call
  }

  const { params } = specOperation

  // Make sure `task.call` remains `undefined` if it is and no parameter is added
  if (Object.keys(params).length === 0) {
    return call
  }

  const paramsA = removeOptionals({ params, call })

  const paramsB = mapValues(paramsA, schema => generateRandom({ schema, helpers }))

  // Specification params have less priority than `task.call.*`
  const callA = mergeAll([paramsB, call])
  return callA
}

const generateRandom = function({ schema, helpers }) {
  return helpers({ $$random: schema })
}

module.exports = {
  addSpecToCall,
}
