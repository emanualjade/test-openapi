'use strict'

const { flatten } = require('lodash')

const { isObject } = require('../../utils')

// Retrieve `x-tests.name.*` into requests paramters
const getSettingsParams = function({ specReqParams, securityParams, settings }) {
  const settingsA = Object.entries(settings)
    .filter(([name]) => !RESPONSE_PROPS.includes(name))
    .map(getSettingParam)
  const settingsB = addSettingsParamsLocation({
    specReqParams,
    securityParams,
    settings: settingsA,
  })
  const settingsC = splitSettings({ settings: settingsB })
  return settingsC
}

const RESPONSE_PROPS = ['response', 'responseHeaders', 'responseStatus']

// `x-tests.name.paramName` value can either be null|undefined, true, false or an object
const getSettingParam = function([name, schema]) {
  if (!isObject(schema)) {
    return { name, schema, isSetting: true }
  }

  const { collectionFormat, required = false, ...schemaA } = schema
  return { name, collectionFormat, required, schema: schemaA, isSetting: true }
}

// Settings parameters name is either `paramName` or `location_paramName`
const addSettingsParamsLocation = function({ specReqParams, securityParams, settings }) {
  return settings.map(setting =>
    addSettingParamLocation({ specReqParams, securityParams, setting }),
  )
}

const addSettingParamLocation = function({
  specReqParams,
  securityParams,
  setting,
  setting: { name },
}) {
  const [locationOrSecType, ...nameA] = name.split('_')
  const hasUnderscore = nameA.length !== 0

  // We used `location_paramName`, not `paramName`
  if (hasUnderscore && isValidLocation({ locationOrSecType })) {
    return { ...setting, location: locationOrSecType, name: nameA.join('_') }
  }

  // Can also be `secName` instead
  const securityParam = findSecurityParam({ securityParams, setting })
  if (securityParam !== undefined) {
    const { name, secName } = securityParam
    return { ...setting, secName, name }
  }

  const locationA = findSettingParamLocation({ specReqParams, setting })
  return { ...setting, location: locationA, name }
}

const isValidLocation = function({ locationOrSecType }) {
  return PARAM_LOCATIONS.includes(locationOrSecType)
}

// Valid values for OpenAPI parameter `location` property
const PARAM_LOCATIONS = ['query', 'header', 'path', 'body', 'formData']

const findSecurityParam = function({ securityParams, setting }) {
  return flatten(securityParams).find(({ secName }) => setting.name === secName)
}

const findSettingParamLocation = function({ specReqParams, setting }) {
  // We should have already validated that every `x-tests.name.*` correspond
  // to a real parameter or security definition
  const param = specReqParams.find(param => param.name === setting.name)
  if (param === undefined) {
    return
  }

  return param.location
}

const splitSettings = function({ settings }) {
  const secSettings = settings.filter(({ secName }) => secName !== undefined)
  const nonSecSettings = settings.filter(({ secName }) => secName === undefined)
  return { secSettings, nonSecSettings }
}

module.exports = {
  getSettingsParams,
}
