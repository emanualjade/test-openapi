'use strict'

// Retrieve `config.plugins`
const getConfigPlugins = function({ config: { plugins, ...config } }) {
  const pluginsA = [...DEFAULT_PLUGINS, ...plugins]
  return { config, plugins: pluginsA }
}

// Plugins always included
// `start`, i.e. before all tasks:
//   - `glob`: merge tasks whose name include globbing matching other task names.
//   - `only`: check if `config|task.only` is used
//   - `spec`: parse, validate and normalize an OpenAPI specification
//   - `report`: start reporting
//   - `repeat`: repeat each task `config.repeat` times
// `task`, i.e. for each task:
//   - `only`: select tasks according to `config|task.only`
//   - `skip`: skip task if `task.skip: true`
//   - `deps`: replace all `deps`, i.e. references to other tasks
//   - `spec`: add OpenAPI specification to `task.random|validate.*`
//   - `random`: generates random values based on `task.random.*` JSON schemas
//   - `call`: fire HTTP call
//   - `validate`: validate response against `task.validate.*` JSON schemas
// `complete`, i.e. after each tasks:
//   - `report`: reporting for current task
// `end`, i.e. after all tasks:
//   - `report`: end of reporting
const DEFAULT_PLUGINS = [
  'glob',

  'only',
  'skip',
  'repeat',
  'deps',
  'spec',
  'random',
  'call',
  'validate',

  'report',
]

module.exports = {
  getConfigPlugins,
}
