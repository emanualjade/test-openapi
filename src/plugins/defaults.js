'use strict'

const { set, merge } = require('lodash')

// Apply plugin-specific configuration default values
const applyPluginsDefaults = function({ config, plugins }) {
  const configA = applyGeneralDefaults({ config, plugins })
  const configB = applyTaskDefaults({ config: configA, plugins })
  return { config: configB }
}

const applyGeneralDefaults = function({ config, plugins }) {
  const generalDefaults = getPluginsDefaults({ plugins, type: 'general' })
  const configA = merge({}, ...generalDefaults, config)
  return configA
}

const applyTaskDefaults = function({ config, config: { tasks }, plugins }) {
  const taskDefaults = getPluginsDefaults({ plugins, type: 'task' })
  const tasksA = tasks.map(task => merge({}, ...taskDefaults, task))
  return { ...config, tasks: tasksA }
}

const getPluginsDefaults = function({ plugins, type }) {
  const defaultValues = plugins.map(plugin => getPluginDefaults({ plugin, type }))
  const defaultValuesA = [].concat(...defaultValues)
  return defaultValuesA
}

const getPluginDefaults = function({ plugin: { name, config: pluginConfig = {} }, type }) {
  return Object.entries(pluginConfig)
    .filter(configEntry => hasDefaults(type, configEntry))
    .map(configEntry => getDefaults(type, configEntry, name))
}

const hasDefaults = function(type, [configName, { schema: { default: defaultValue } = {} }]) {
  return configName.startsWith(type) && defaultValue !== undefined
}

const getDefaults = function(type, [configName, { schema: { default: defaultValue } = {} }], name) {
  const path = configName.replace(type, name)
  return set({}, path, defaultValue)
}

module.exports = {
  applyPluginsDefaults,
}
