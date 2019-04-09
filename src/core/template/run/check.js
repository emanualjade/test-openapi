import { pickBy, omitBy, mapKeys, mapValues } from 'lodash'

import { BugError, TestOpenApiError } from '../../../errors.js'
import { getPath, numberToCardinal } from '../../../utils.js'
import { checkSchema } from '../../../validation.js'

// Wrap template helper functions with JSON schema validation from
// `plugin.config['template.*']`
const wrapTemplateVars = function({ vars, plugin }) {
  const templateConfig = getTemplateConfig({ plugin })

  const varsA = mapValues(templateConfig, (schema, name) =>
    wrapTemplateVar({ value: vars[name], name, schema, plugin }),
  )

  const varsB = omitBy(varsA, value => value === undefined)
  return { ...vars, ...varsB }
}

// Return `plugin.config['template.*']`
const getTemplateConfig = function({ plugin: { config } }) {
  const templateConfig = pickBy(config, (value, key) =>
    key.startsWith(TEMPLATE_CONFIG_PREFIX),
  )
  const templateConfigA = mapKeys(templateConfig, (value, key) =>
    key.replace(TEMPLATE_CONFIG_PREFIX, ''),
  )
  return templateConfigA
}

const TEMPLATE_CONFIG_PREFIX = 'template.'

// Wrap the template helper function
const wrapTemplateVar = function({ value, name, schema, plugin }) {
  // Some template values might be optionally generated, so we ignore
  // `undefined`
  if (value === undefined) {
    return
  }

  const schemaProp = getPath(['plugin', 'config', `template.${name}`])

  validateTemplateConfig({ value, name, schemaProp, plugin })

  const valueA = templateVarWrapper.bind(null, { value, name, schema })
  return valueA
}

// Make sure it is a function before wrapping it
const validateTemplateConfig = function({ value, name, schemaProp, plugin }) {
  if (typeof value === 'function') {
    return
  }

  throw new BugError(
    `'plugin.config["template.${name}"]' can only be defined if 'plugin.template.${name}' is a function`,
    { value, property: schemaProp, module: `plugin-${plugin.name}` },
  )
}

// Wrap `value(...args)` to first perform JSON validation
const templateVarWrapper = function({ value, name, schema }, ...args) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  schemas.forEach((schemaA, index) =>
    checkVar({ schema: schemaA, value: args[index], name, index }),
  )

  return value(...args)
}

const checkVar = function({ schema, value, name, index }) {
  const message = getMessage({ name, index })

  if (value === undefined) {
    return checkVarUndefined({ schema, message })
  }

  checkSchema({ schema, value, message })
}

const getMessage = function({ name, index }) {
  const cardinal = numberToCardinal(index + 1)
  const message = `${cardinal} argument to '${name}'`
  return message
}

// Helper function arguments cannot be `undefined` unless
// `schema.x-optional: true`
const checkVarUndefined = function({
  schema: { 'x-optional': isOptional = false },
  message,
}) {
  if (isOptional) {
    return
  }

  throw new TestOpenApiError(`${message} must be defined`)
}

module.exports = {
  wrapTemplateVars,
}
