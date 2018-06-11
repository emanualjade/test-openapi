'use strict'

const { uniq, mapValues } = require('lodash')

const { isObject } = require('../../../utils')

// `params` with `random: full` are always deeply generated.
// `params` with `random: shallow` only generate the properties that are
// `required` in the JSON schema. But if they are merged into another param,
// all the properties from that other param should be added as `required`,
// so we can merge them.
// E.g. with OpenAPI parameters, optional parameters will be re-used if merged
// into some `task.call|random.*`. Otherwise they won't be.
const fixRequireds = function({ params, random, call }) {
  return mapValues(params, (param, key) => fixRequired({ param, key, random, call }))
}

const fixRequired = function({ param, key, call, random }) {
  const requiredProps = getRequiredProps({ key, call, random })
  const paramA = addRequired({ schema: param, requiredProps })
  return paramA
}

const getRequiredProps = function({ key, call, random }) {
  const callProperties = getParamsProperties({ value: call[key], type: 'call' })
  const randomProperties = getParamsProperties({ value: random[key], type: 'random' })
  return { ...callProperties, ...randomProperties }
}

// Retrieve unique paths of all properties of all parameters
const getParamsProperties = function({ value, type }) {
  const properties = getProperties({ value, type })
  const propertiesA = [].concat(...properties)
  const propertiesB = uniq(propertiesA)
  return propertiesB
}

// Find all properties paths (e.g. `a.b.c`) in a JSON schema or a normal object.
// We only use `properties` not `additionalProperties` nor `patternProperties`
// because only `properties` can be made `required`
const getProperties = function({ value, path = 'root', type }) {
  const children = getChildren[type](value)

  if (!isObject(children)) {
    return [path]
  }

  const paths = Object.entries(children).map(([name, child]) =>
    getProperties({ value: child, path: `${path}.${name}`, type }),
  )
  const pathsA = [].concat(...paths)
  const pathsB = [path, ...pathsA]
  return pathsB
}

const getChildren = {
  call: value => value,
  random: ({ properties }) => properties,
}

// Add all properties as JSON schema `required`
const addRequired = function({
  schema,
  schema: { properties, required = [] },
  path = 'root',
  requiredProps,
}) {
  if (properties === undefined || !isRequiredProp({ path, requiredProps })) {
    return schema
  }

  const newRequired = Object.keys(properties).filter(name =>
    isRequiredProp({ path: `${path}.${name}`, requiredProps }),
  )
  const requiredA = uniq([...required, ...newRequired])

  const propertiesA = mapValues(properties, (property, name) =>
    addRequired({ schema: property, path: `${path}.${name}`, requiredProps }),
  )

  return { ...schema, required: requiredA, properties: propertiesA }
}

const isRequiredProp = function({ path, requiredProps }) {
  return requiredProps.some(requiredProp => path.startsWith(requiredProp))
}

module.exports = {
  fixRequireds,
}
