'use strict'

const { uniq, difference } = require('lodash')

const { TestOpenApiError } = require('../errors')

// Make sure the user did not forget to include some plugins
const validateMissingPlugins = function({ config, plugins }) {
  const missingPlugins = getMissingPlugins({ config, plugins })
  if (missingPlugins.length === 0) {
    return
  }

  const missingPluginsA = missingPlugins.join(', ')
  throw new TestOpenApiError(
    `The configuration uses the following plugins but they are not specified in 'configuration.plugins': ${missingPluginsA}`,
    { property: 'plugins' },
  )
}

const getMissingPlugins = function({ config, plugins }) {
  const usedPlugins = getUsedPlugins({ config })
  const pluginsA = plugins.map(({ name }) => name)

  const missingPlugins = difference(usedPlugins, pluginsA)
  return missingPlugins
}

// Guess which plugins are used by the current configuration
const getUsedPlugins = function({ config }) {
  const usedPlugins = findUsedPlugins({ config })
  const usedPluginsA = cleanUsedPlugins({ usedPlugins })
  return usedPluginsA
}

const findUsedPlugins = function({ config, config: { tasks } }) {
  const generalPlugins = Object.keys(config)
  const taskPlugins = tasks.map(Object.keys)
  const usedPlugins = [].concat(...taskPlugins, ...generalPlugins)
  return usedPlugins
}

const cleanUsedPlugins = function({ usedPlugins }) {
  const usedPluginsA = uniq(usedPlugins)
  const usedPluginsB = usedPluginsA.filter(name => !CORE_PROPS.includes(name))
  return usedPluginsB
}

// Those properties are not plugin-related
const CORE_PROPS = ['tasks', 'originalTask', 'key']

module.exports = {
  validateMissingPlugins,
}
