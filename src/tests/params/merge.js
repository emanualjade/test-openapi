'use strict'

const { mergeInputs } = require('../merge')

// Deeply merge request parameters with the same `name` and `location`
const mergeParams = function({
  specReqParams,
  securityParams,
  contentNegotiations,
  testsParams: { secTestParams, nonSecTestParams },
}) {
  const securityParamsA = getSecurityParams({ securityParams, secTestParams })
  return securityParamsA.map(security =>
    mergeEachParams({ specReqParams, security, contentNegotiations, nonSecTestParams }),
  )
}

// OpenAPI specification allows an alternative of sets of authentication-related
// request parameters, so `specReqParams` is an array of arrays.
// We only keep security alternatives that have been directly specified in `testOpts`
const getSecurityParams = function({ securityParams, secTestParams }) {
  const securityParamsA = securityParams
    .filter(security => isSelectedSecurity({ security, secTestParams }))
    .map(security => mergeSecTestParams({ security, secTestParams }))
  if (securityParamsA.length === 0) {
    return [[]]
  }

  return securityParamsA
}

const isSelectedSecurity = function({ security, secTestParams }) {
  return security.some(securityParam => isSelectedSecurityParam({ securityParam, secTestParams }))
}

const isSelectedSecurityParam = function({ securityParam, secTestParams }) {
  return secTestParams.some(({ secName }) => secName === securityParam.secName)
}

const mergeSecTestParams = function({ security, secTestParams }) {
  const securityA = [...security, ...secTestParams]
  const securityB = mergeInputs({ inputs: securityA })
  return securityB
}

const mergeEachParams = function({
  specReqParams,
  security,
  contentNegotiations,
  nonSecTestParams,
}) {
  const params = [...contentNegotiations, ...security, ...specReqParams, ...nonSecTestParams]
  const paramsA = mergeInputs({ inputs: params })
  return paramsA
}

module.exports = {
  mergeParams,
}
