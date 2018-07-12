'use strict'

const { checkSchema } = require('../validation')

// Validate plugin-specific configuration against a JSON schema specified in
// `plugin.config`
const verifyConfig = function({
  plugin: { config: { general: schema } = {}, name },
  config: { [name]: value },
}) {
  if (schema === undefined || value === undefined) {
    return
  }

  checkSchema({
    schema,
    value,
    name: `config.${name}`,
    propName: `config.${name}`,
    message: `Configuration is invalid:`,
    props: { plugin: name },
  })
}

// Validate plugin-specific task configuration against a JSON schema specified in
// `plugin.task`
const verifyTask = function({
  plugin: { config: { task: schema } = {}, name },
  task: { [name]: value },
}) {
  if (schema === undefined || value === undefined) {
    return
  }

  checkSchema({
    schema,
    value,
    name,
    propName: name,
    message: `Task configuration is invalid:`,
    props: { plugin: name },
  })
}

module.exports = {
  verifyConfig,
  verifyTask,
}
