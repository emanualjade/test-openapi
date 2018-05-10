'use strict'

const { mergeInputs } = require('../merge')

// Get list of authentication-related headers or query variables
const getSecChoices = function({ operationObject, testRequest }) {
  const { secTestRequest, testRequest: testRequestA } = getSecTestRequest({ testRequest })

  const secChoices = getChoices({ operationObject, secTestRequest })

  return { testRequest: testRequestA, secChoices }
}

const getSecTestRequest = function({ testRequest }) {
  const secTestRequest = testRequest.filter(({ location }) => location === 'security')
  const testRequestA = testRequest.filter(({ location }) => location !== 'security')
  return { secTestRequest, testRequest: testRequestA }
}

// OpenAPI specification allows an alternative of sets of authentication-related
// request parameters, so `request` is an array of arrays.
// We only keep security alternatives that have been directly specified in `test.request.security.*`
const getChoices = function({ secTestRequest, operationObject }) {
  const operationSecs = getOperationSecs({ operationObject })

  const secChoices = operationSecs
    .map(operationSec => getSecRequest({ operationSec, operationObject, secTestRequest }))
    .filter(secRequest => secRequest !== undefined)

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

const getSecRequest = function({ operationSec, operationObject, secTestRequest }) {
  const secRequest = findSecRequest({ operationSec, operationObject })

  const secTestRequestA = normalizeSecTestRequest({ secTestRequest, secRequest })

  // Only use security request parameters if specified in `test.request.security`
  if (secTestRequestA.length === 0) {
    return
  }

  const secRequestA = mergeSecTestRequest({ secRequest, secTestRequest: secTestRequestA })
  return secRequestA
}

// Retrieve possible security parameters from specification
const findSecRequest = function({ operationSec, operationObject }) {
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
const normalizeSecTestRequest = function({ secTestRequest, secRequest }) {
  return secTestRequest
    .map(secTestParam => normalizeSecTestParam({ secTestParam, secRequest }))
    .filter(secTestParam => secTestParam !== undefined)
}

const normalizeSecTestParam = function({
  secTestParam,
  secTestParam: { name, schema },
  secRequest,
}) {
  const secParam = secRequest.find(({ secName }) => secName === name)
  if (secParam === undefined) {
    return
  }

  return { ...secParam, schema }
}

// Merge `test.request.security`
const mergeSecTestRequest = function({ secRequest, secTestRequest }) {
  const inputs = [...secRequest, ...secTestRequest]
  const secRequestA = mergeInputs({ inputs })
  return secRequestA
}

module.exports = {
  getSecChoices,
}
