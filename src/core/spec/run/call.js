'use strict'

const { mapValues } = require('lodash')

const { merge } = require('../../../utils')
const { $$random } = require('../../../template_vars')

const { getSpecialValues } = require('./special')
const { removeOptionals } = require('./optional')
const { setInvalidParams } = require('./invalid')

// Add OpenAPI specification parameters to `task.call.*`
const addSpecToCall = function({ call, operation: { params } }) {
  // Make sure `task.call` remains `undefined` if it is and no parameter is added
  if (Object.keys(params).length === 0) {
    return call
  }

  const paramsA = removeOptionals({ params, call })

  const { call: callA, specialValues } = getSpecialValues({ call })

  const paramsB = setInvalidParams({ params: paramsA, specialValues })

  const paramsC = mapValues(paramsB, schema => $$random(schema))

  // Specification params have less priority than `task.call.*`
  const callB = merge(paramsC, callA)
  return callB
}

module.exports = {
  addSpecToCall,
}
