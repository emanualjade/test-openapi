import { merge } from '../../../../../utils/merge.js'
import { getNegotiationsParams } from '../content_negotiation.js'

import { normalizeParams } from './normalize.js'
import { normalizeFormData } from './form_data.js'
import { getSecParams } from './security.js'
import { getConstants } from './constants.js'

// Normalize OpenAPI request parameters into specification-agnostic format
export const getParams = function({
  spec,
  method,
  path,
  pathDef: { parameters: pathDefParams = [] },
  operation,
  operation: { parameters: params = [] },
}) {
  const paramsA = [...pathDefParams, ...params]

  const paramsB = normalizeParams({ params: paramsA })

  const contentNegotiations = getNegotiationsParams({
    spec,
    operation,
    params: paramsB,
  })

  const paramsC = normalizeFormData({ params: paramsB })

  const secParams = getSecParams({ spec, operation })

  const constants = getConstants({ spec, operation, method, path })

  const paramsD = merge(contentNegotiations, secParams, paramsC, constants)

  return paramsD
}
