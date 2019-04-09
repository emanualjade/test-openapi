import { verifyTask } from '../../plugins.js'

// Validate plugin-specific configuration
// Must be done after templating.
const run = function(task, { _plugins: plugins }) {
  plugins.forEach(plugin => verifyTask({ task, plugin }))
}

module.exports = {
  run,
}
