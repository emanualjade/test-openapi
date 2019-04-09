import { mapValues } from 'lodash'

import { merge } from '../../../utils.js'
import {
  template: { $$random },
} from '../../template.js'

import { getSpecialValues } from './special.js'
import { removeOptionals } from './optional.js'
import { setInvalidParams } from './invalid.js'

// Add OpenAPI specification parameters to `task.call.*`
const addSpecToCall = function({ call, operation: { params } }) {
  // Make sure `task.call` remains `undefined` if it is and no parameter is
  // added
  if (Object.keys(params).length === 0) {
    return call
  }

  const callA = call === undefined ? {} : call

  const paramsA = removeOptionals({ params, call: callA })

  const { call: callB, specialValues } = getSpecialValues({ call: callA })

  const paramsB = setInvalidParams({ params: paramsA, specialValues })

  const paramsC = mapValues(paramsB, schema => $$random(schema))

  // Specification params have less priority than `task.call.*`
  const callC = merge(paramsC, callB)
  return callC
}

module.exports = {
  addSpecToCall,
}
