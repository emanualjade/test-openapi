import { mapValues, omit, omitBy } from 'lodash'

// Spec parameters are only generated if either:
//  - they are required
//  - the parameter is also specified in `task.call.*`
//    (including as `valid` or `invalid`)
// This works both top-level and for nested properties
export const removeOptionals = function({ params, call }) {
  const paramsA = removeTopLevel({ params, call })
  const paramsB = removeNested({ params: paramsA, call })
  return paramsB
}

// Spec parameters are marked as required by using `optional: false` (default)
const removeTopLevel = function({ params, call }) {
  const paramsA = omitBy(params, (param, key) =>
    isSkippedOptional({ param, key, call }),
  )
  const paramsB = mapValues(paramsA, removeOptionalProp)
  return paramsB
}

const isSkippedOptional = function({ param: { optional }, key, call }) {
  return optional && call[key] === undefined
}

// Remove `optional` now that it's been used (it is not valid JSON schema)
const removeOptionalProp = function(param) {
  return omit(param, 'optional')
}

// Spec nested properties are marked as required by using JSON schema `required`
const removeNested = function({ params, call }) {
  return mapValues(params, (schema, key) =>
    removeNonRequired({ schema, definedProps: call[key] }),
  )
}

// Remove properties that are neither required nor specified in `definedProps`
const removeNonRequired = function({
  schema: { properties, required = [], ...schema },
  definedProps = {},
}) {
  if (properties === undefined) {
    return schema
  }

  const propertiesA = omitBy(
    properties,
    (property, name) =>
      !required.includes(name) && definedProps[name] === undefined,
  )

  const propertiesB = mapValues(propertiesA, (property, name) =>
    removeNonRequired({ schema: property, definedProps: definedProps[name] }),
  )

  return { ...schema, properties: propertiesB }
}
