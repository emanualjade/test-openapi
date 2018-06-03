'use strict'

const jsonSchemaFaker = require('json-schema-faker')
const { uniq, mapValues } = require('lodash')

const { isSameParam, isObject } = require('../../utils')

// `params` with `random: optional` are only kept when merged with another
// parameter. E.g. OpenAPI parameters that are `required: false` will only be
// used if merged into some other `task.call|random.*` parameter.
// This also means using an empty object in `task.call|random.*` allows re-using
// spec parameters.
const isSkippedOptional = function({ param, param: { random }, params }) {
  return random === 'optional' && isNotMerged({ param, params })
}

const isNotMerged = function({ param, params }) {
  return !params.some(paramB => willBeMerged(param, paramB))
}

const willBeMerged = function(paramA, paramB) {
  return paramA !== paramB && isSameParam(paramA, paramB)
}

// `params` with `random: full` are always deeply generated.
// `params` with `random: shallow|optional` only generate the properties that are
// `required` in the JSON schema. But if they are merged into another param,
// all the properties from that other param should be added as `required`,
// so we can merge them.
// E.g. with OpenAPI parameters, optional parameters will be re-used if merged
// into some `task.call|random.*`. Otherwise they won't be.
const fixRequired = function({ param, param: { random }, params }) {
  if (random !== 'shallow' && random !== 'optional') {
    return param
  }

  const paramsA = params.filter(paramB => willBeMerged(param, paramB))

  if (paramsA.length === 0) {
    return param
  }

  const properties = getParamsProperties({ params: paramsA })
  const paramA = addRequired({ param, properties })
  return paramA
}

const getParamsProperties = function({ params }) {
  const properties = params.map(getParamProperties)
  const propertiesA = [].concat(...properties)
  const propertiesB = uniq(propertiesA)
  return propertiesB
}

const getParamProperties = function({ value, random }) {
  if (random === undefined) {
    return getProperties({ value, getChildren: getNonSchemaChildren })
  }

  return getProperties({ value, getChildren: getSchemaChildren })
}

const getNonSchemaChildren = function(value) {
  return value
}

const getSchemaChildren = function({ properties }) {
  return properties
}

// Find all properties paths (e.g. `a.b.c`) in a JSON schema or a normal object.
// We only use `properties` not `additionalProperties` nor `patternProperties`
// because only `properties` can be made `required`
const getProperties = function({ value, path = 'root', getChildren }) {
  const children = getChildren(value)

  if (!isObject(children)) {
    return [path]
  }

  const paths = Object.entries(children).map(([name, child]) =>
    getProperties({ value: child, path: `${path}.${name}`, getChildren }),
  )
  const pathsA = [].concat(...paths)
  const pathsB = [path, ...pathsA]
  return pathsB
}

// Add all properties as JSON schema `required`
const addRequired = function({ param: { value: schema, ...param }, properties: requiredProps }) {
  const value = addRequiredProperties({ schema, requiredProps })
  return { ...param, value }
}

const addRequiredProperties = function({
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
    addRequiredProperties({ schema: property, path: `${path}.${name}`, requiredProps }),
  )

  return { ...schema, required: requiredA, properties: propertiesA }
}

const isRequiredProp = function({ path, requiredProps }) {
  return requiredProps.some(requiredProp => path.startsWith(requiredProp))
}

// When `random` is `deep`, all deep properties are generated regardless of `required`.
// E.g. `task.call|random.*` are always deeply generated because they are
// explicited by the user.
// When `random` is `shallow` or `optional`, `required` is used to determine
// whether deep properties should be geneated.
// E.g. `spec` parameters use this.
const addOptionalsProbability = function({ param: { random } }) {
  const optionalsProbability = PROBABILITY[random]
  jsonSchemaFaker.option({ optionalsProbability })
}

const PROBABILITY = {
  deep: 1,
  shallow: 0,
  optional: 0,
}

module.exports = {
  isSkippedOptional,
  fixRequired,
  addOptionalsProbability,
}
