'use strict'

const { TestOpenApiError } = require('../errors')
const { validateFromSchema } = require('../validation')

// Validate plugin-specific configuration against a JSON schema specified in
// `plugin.config`
const verifyConfig = function({
  plugin: { config: { general: schema } = {}, name },
  config: { [name]: value },
}) {
  verify({ value, schema, name: `config.${name}`, message: 'Configuration', plugin: name })
}

// Validate plugin-specific task configuration against a JSON schema specified in
// `plugin.task`
const verifyTask = function({
  plugin: { config: { task: schema } = {}, name },
  task: { [name]: value },
}) {
  verify({ value, schema, name, message: 'Task configuration' })
}

const verify = function({ value, schema, name, message, plugin }) {
  if (schema === undefined || value === undefined) {
    return
  }

  const { error, path } = validateFromSchema({ schema, value, name })
  if (error === undefined) {
    return
  }

  const property = getProperty({ name, path })
  throw new TestOpenApiError(`${message} is invalid: ${error}`, { property, schema, value, plugin })
}

const getProperty = function({ name, path }) {
  if (path === '') {
    return name
  }

  return `${name}.${path}`
}

module.exports = {
  verifyConfig,
  verifyTask,
}
