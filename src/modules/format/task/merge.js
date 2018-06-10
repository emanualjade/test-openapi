'use strict'

const { mergeParams } = require('../../../utils')

// Merge all parameters with same `name` and `location`
// `params` must be ordered from least to most priority
const mergeAllParams = function({ params }) {
  const paramsA = mergeParams(params)

  const paramsB = removeNull({ params: paramsA })
  return paramsB
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
