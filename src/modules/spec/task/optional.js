'use strict'

const { mapValues, omit, omitBy } = require('lodash')

const { isObject } = require('../../../utils')

// Spec parameters are only generated if either:
//  - they are required
//  - the parameter is also specified in `task.call|random.*`
//    (including as an empty object)
// This works both top-level and for nested properties
const removeOptionals = function({ params, call, random }) {
  const paramsA = removeTopLevel({ params, call, random })
  const paramsB = removeNested({ params: paramsA, call, random })
  return paramsB
}

// Spec parameters are marked as required by using `optional: false` (default)
const removeTopLevel = function({ params, call, random }) {
  const paramsA = omitBy(params, (param, key) => isSkippedOptional({ param, key, call, random }))
  const paramsB = mapValues(paramsA, removeOptionalProp)
  return paramsB
}

const isSkippedOptional = function({ param: { optional }, key, call, random }) {
  return optional && call[key] === undefined && random[key] === undefined
}

// Remove `optional` now that it's been used (it is not valid JSON schema)
const removeOptionalProp = function(param) {
  return omit(param, 'optional')
}

// Spec nested properties are marked as required by using JSON schema `required`
const removeNested = function({ params, call, random }) {
  const definedProps = getDefinedProps({ call, random })

  const paramsA = mapValues(params, (schema, key) =>
    removeNonRequired({ schema, definedProps: definedProps[key] }),
  )
  return paramsA
}

// Retrieve all nested properties that have been defined in `task.call|random.*`
const getDefinedProps = function({ call, random }) {
  const randomProperties = getProperties({ properties: random })
  return { ...call, ...randomProperties }
}

// Turn JSON schema `properties` into a plain object
const getProperties = function({ properties }) {
  if (!isObject(properties)) {
    return true
  }

  return mapValues(properties, getProperties)
}

// Remove properties that are neither required nor specified in `definedProps`
const removeNonRequired = function({
  schema: { properties, required = [], ...schema },
  definedProps = {},
}) {
  if (properties === undefined) {
    return schema
  }

  const propertiesA = omitBy(properties, (property, name) => {
    return !required.includes(name) && definedProps[name] === undefined
  })

  const propertiesB = mapValues(propertiesA, (property, name) =>
    removeNonRequired({ schema: property, definedProps: definedProps[name] }),
  )

  return { ...schema, properties: propertiesB }
}

module.exports = {
  removeOptionals,
}
