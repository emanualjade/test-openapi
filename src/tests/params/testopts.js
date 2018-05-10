'use strict'

const { flatten } = require('lodash')

const { isObject } = require('../../utils')

// Translate `testOpts` into requests paramters
const getTestParams = function({ specReqParams, securityParams, testOpts }) {
  const testParams = Object.entries(testOpts)
    .filter(([name]) => !RESPONSE_PROPS.includes(name))
    .map(getTestParam)
  const testParamsA = addTestParamsLocation({ specReqParams, securityParams, testParams })
  const testParamsB = splitTestParams({ testParams: testParamsA })
  return testParamsB
}

const RESPONSE_PROPS = ['response']

// `testOpt` value can either be null|undefined, true, false or an object
const getTestParam = function([name, schema]) {
  if (!isObject(schema)) {
    return { name, schema, isTestOpt: true }
  }

  const { collectionFormat, required = false, ...schemaA } = schema
  return { name, collectionFormat, required, schema: schemaA, isTestOpt: true }
}

// `testOpts`'s parameters name is either `paramName` or `location_paramName`
const addTestParamsLocation = function({ specReqParams, securityParams, testParams }) {
  return testParams.map(testParam =>
    addTestParamLocation({ specReqParams, securityParams, testParam }),
  )
}

const addTestParamLocation = function({
  specReqParams,
  securityParams,
  testParam,
  testParam: { name },
}) {
  const [locationOrSecType, ...nameA] = name.split('_')
  const hasUnderscore = nameA.length !== 0

  // We used `location_paramName`, not `paramName`
  if (hasUnderscore && isValidLocation({ locationOrSecType })) {
    return { ...testParam, location: locationOrSecType, name: nameA.join('_') }
  }

  // Can also be `secName` instead
  const securityParam = findSecurityParam({ securityParams, testParam })
  if (securityParam !== undefined) {
    const { name, secName } = securityParam
    return { ...testParam, secName, name }
  }

  const locationA = findTestParamLocation({ specReqParams, testParam })
  return { ...testParam, location: locationA, name }
}

const isValidLocation = function({ locationOrSecType }) {
  return PARAM_LOCATIONS.includes(locationOrSecType)
}

// Valid values for OpenAPI parameter `location` property
const PARAM_LOCATIONS = ['query', 'header', 'path', 'body', 'formData']

const findSecurityParam = function({ securityParams, testParam }) {
  return flatten(securityParams).find(({ secName }) => testParam.name === secName)
}

const findTestParamLocation = function({ specReqParams, testParam }) {
  // We should have already validated that every `testOpt` correspond
  // to a real parameter or security definition
  const param = specReqParams.find(param => param.name === testParam.name)
  if (param === undefined) {
    return
  }

  return param.location
}

const splitTestParams = function({ testParams }) {
  const secTestParams = testParams.filter(({ secName }) => secName !== undefined)
  const nonSecTestParams = testParams.filter(({ secName }) => secName === undefined)
  return { secTestParams, nonSecTestParams }
}

module.exports = {
  getTestParams,
}
