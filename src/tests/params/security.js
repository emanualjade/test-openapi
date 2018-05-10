'use strict'

const { mergeInputs } = require('../merge')

// Get list of authentication-related headers or query variables
const getSecChoices = function({ operationObject, testParams }) {
  const { secTestParams, testParams: testParamsA } = getSecTestParams({ testParams })

  const secChoices = getChoices({ operationObject, secTestParams })

  return { testParams: testParamsA, secChoices }
}

const getSecTestParams = function({ testParams }) {
  const secTestParams = testParams.filter(({ location }) => location === 'security')
  const testParamsA = testParams.filter(({ location }) => location !== 'security')
  return { secTestParams, testParams: testParamsA }
}

// OpenAPI specification allows an alternative of sets of authentication-related
// request parameters, so `specReqParams` is an array of arrays.
// We only keep security alternatives that have been directly specified in `testOpts`
const getChoices = function({ secTestParams, operationObject }) {
  const operationSecs = getOperationSecs({ operationObject })

  const secChoices = operationSecs
    .map(operationSec => getSecParams({ operationSec, operationObject, secTestParams }))
    .filter(secParams => secParams !== undefined)

  // Means no security parameters will be used
  if (secChoices.length === 0) {
    return [[]]
  }

  return secChoices
}

// We do not use Sway's `operationObject.securityDefinitions` because it does not
// take into account that securities can be alternatives (i.e. an array of objects).
const getOperationSecs = function({
  operationObject: {
    security: operationSecurity,
    pathObject: {
      api: { security: apiSecurity = [] },
    },
  },
}) {
  if (operationSecurity !== undefined) {
    return operationSecurity
  }

  return apiSecurity
}

const getSecParams = function({ operationSec, operationObject, secTestParams }) {
  const secParams = findSecParams({ operationSec, operationObject })

  const secTestParamsA = normalizeSecTestParams({ secTestParams, secParams })

  // Only use security params if specified in `test.request.security`
  if (secTestParamsA.length === 0) {
    return
  }

  const secParamsA = mergeSecTestParams({ secParams, secTestParams: secTestParamsA })
  return secParamsA
}

// Retrieve possible security parameters from specification
const findSecParams = function({ operationSec, operationObject }) {
  return Object.entries(operationSec).map(([secName, scopes]) =>
    getSecParam({ secName, scopes, operationObject }),
  )
}

// Normalize security to the same format as other parameters
const getSecParam = function({
  secName,
  scopes,
  operationObject: {
    pathObject: {
      api: {
        securityDefinitions: { [secName]: def },
      },
    },
  },
}) {
  const handler = getSecParamHandler(def)
  const secParam = handler({ ...def, scopes })
  const secParamA = { secName, ...secParam }
  return secParamA
}

const getSecParamHandler = function({ type }) {
  const handler = SECURITY_DEFS[type]
  if (handler !== undefined) {
    return handler
  }

  throw new Error(`Security definitions of type '${type}' are not implemented yet`)
}

// `apiKey` security definitions -> `header|query` request paramater
const getDefApiKey = function({ name, in: location }) {
  return { name, location, required: true, schema: { type: 'string' } }
}

const SECURITY_DEFS = {
  apiKey: getDefApiKey,
}

// Find security parameter for each `test.request.security.SEC_NAME` and merge
// it except `schema`
const normalizeSecTestParams = function({ secTestParams, secParams }) {
  return secTestParams
    .map(secTestParam => normalizeSecTestParam({ secTestParam, secParams }))
    .filter(secTestParam => secTestParam !== undefined)
}

const normalizeSecTestParam = function({
  secTestParam,
  secTestParam: { name, schema },
  secParams,
}) {
  const secParam = secParams.find(({ secName }) => secName === name)
  if (secParam === undefined) {
    return
  }

  return { ...secParam, schema }
}

// Merge `test.request.security`
const mergeSecTestParams = function({ secParams, secTestParams }) {
  const inputs = [...secParams, ...secTestParams]
  const secParamsA = mergeInputs({ inputs })
  return secParamsA
}

module.exports = {
  getSecChoices,
}
