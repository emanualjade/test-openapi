'use strict'

const { deepMerge, mergeParams } = require('../../../utils')

// Merge all parameters with same `name` and `location`
// `params` must be ordered from least to most priority
const mergeAllParams = function({ params }) {
  const paramsA = mergeParams(params, mergeParam)

  const paramsB = removeOptionals({ params: paramsA })

  const paramsC = removeNull({ params: paramsB })
  return paramsC
}

const mergeParam = function(paramOne, paramTwo) {
  const value = mergeParamValue({ paramOne, paramTwo })
  // See below on why we need `required: full`
  return { ...paramOne, ...paramTwo, required: 'full', value }
}

const mergeParamValue = function({ paramOne, paramTwo }) {
  return deepMerge(paramOne.value, paramTwo.value)
}

// `params` with `required: optional` are only kept when merged with another
// parameter. E.g. OpenAPI parameters that are `required: false` will only be
// used if merged into some other `task.call|random.*` parameter.
// This also means using an empty object in `task.call|random.*` allows re-using
// spec parameters.
const removeOptionals = function({ params }) {
  return params.filter(({ required }) => required !== 'optional')
}

// Specifying `null` means 'do not send this parameter'.
// Only applies to top-level value, i.e. should never be an issue.
// This is useful for:
//  - removing parameters specified by another plugin, i.e. removing parameters
//    specified by `spec` plugin
//  - distinguishing from `?queryVar` (empty string) and no `queryVar` (null)
//  - being consistent with `validate` plugin, which use `null` to specify
//    'should not be defined'
// When used with `random` plugin, parameters can be randomly generated or not
// using `type: ['null', ...]`
const removeNull = function({ params }) {
  return params.filter(({ value }) => ({ value } !== null))
}

module.exports = {
  mergeAllParams,
}
