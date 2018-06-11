'use strict'

// Retrieve `config.plugins`
const getConfigPlugins = function({ config: { plugins, ...config } }) {
  const pluginsA = [...DEFAULT_PLUGINS, ...plugins]
  return { config, plugins: pluginsA }
}

// Plugins always included
const DEFAULT_PLUGINS = [
  'call',
  'url',
  'format',
  'random',
  'validate',
  'spec',
  'repeat',
  'glob',
  'deps',
  'only',
  'skip',
  'report',
]

module.exports = {
  getConfigPlugins,
}
