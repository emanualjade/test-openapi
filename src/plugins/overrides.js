'use strict'

const { uniq } = require('lodash')

// Remove all plugins specified in `plugin.overrides`
const removeOverrides = function({ plugins }) {
  const overrides = getOverrides({ plugins })
  const pluginsA = plugins.filter(({ name }) => !overrides.includes(name))
  return { plugins: pluginsA }
}

const getOverrides = function({ plugins }) {
  const overridesA = plugins.map(({ overrides = [] }) => overrides)
  const overridesB = [].concat(...overridesA)
  const overridesC = uniq(overridesB)
  return overridesC
}

module.exports = {
  removeOverrides,
}
