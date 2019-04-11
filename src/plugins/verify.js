import { checkSchema } from '../validation/check.js'

// Validate plugin-specific configuration against a JSON schema specified in
// `plugin.config`
export const verifyConfig = function({
  plugin: { config: { general: schema } = {}, name },
  config: { [name]: value },
}) {
  verifyPluginConfig({ schema, value, name, valueProp: 'config' })
}

// Validate plugin-specific task configuration against a JSON schema specified
// in `plugin.task`
export const verifyTask = function({
  plugin: { config: { task: schema } = {}, name },
  task: { [name]: value },
}) {
  verifyPluginConfig({ schema, value, name, valueProp: 'task' })
}

const verifyPluginConfig = function({ schema, value, name, valueProp }) {
  if (schema === undefined || value === undefined) {
    return
  }

  checkSchema({
    schema,
    value,
    valueProp: `${valueProp}.${name}`,
    message: `Configuration for the '${name}' plugin is invalid`,
    props: { module: `plugin-${name}` },
  })
}
