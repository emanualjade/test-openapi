'use strict'

const { mergeInputs } = require('../merge')

// Deeply merge request parameters with the same `name` and `location`
const mergeParams = function({
  specReqParams,
  securityParams,
  contentNegotiations,
  settingsParams: { secSettings, nonSecSettings },
}) {
  const securityParamsA = getSecurityParams({ securityParams, secSettings })
  return securityParamsA.map(security =>
    mergeEachParams({ specReqParams, security, contentNegotiations, nonSecSettings }),
  )
}

// OpenAPI specification allows an alternative of sets of authentication-related
// request parameters, so `specReqParams` is an array of arrays.
// We only keep security alternatives that have been directly specified in `x-tests.*`
const getSecurityParams = function({ securityParams, secSettings }) {
  const securityParamsA = securityParams
    .filter(security => isSelectedSecurity({ security, secSettings }))
    .map(security => mergeSecSettings({ security, secSettings }))
  if (securityParamsA.length === 0) {
    return [[]]
  }

  return securityParamsA
}

const isSelectedSecurity = function({ security, secSettings }) {
  return security.some(securityParam => isSelectedSecurityParam({ securityParam, secSettings }))
}

const isSelectedSecurityParam = function({ securityParam, secSettings }) {
  return secSettings.some(({ secName }) => secName === securityParam.secName)
}

const mergeSecSettings = function({ security, secSettings }) {
  const securityA = [...security, ...secSettings]
  const securityB = mergeInputs({ inputs: securityA })
  return securityB
}

const mergeEachParams = function({ specReqParams, security, contentNegotiations, nonSecSettings }) {
  const params = [...contentNegotiations, ...security, ...specReqParams, ...nonSecSettings]
  const paramsA = mergeInputs({ inputs: params })
  return paramsA
}

module.exports = {
  mergeParams,
}
