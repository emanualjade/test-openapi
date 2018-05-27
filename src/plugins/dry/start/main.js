'use strict'

// `config.dry: true` will make everything stop just before the first task run
const handleDryRun = function({ dry }) {
  if (!dry) {
    return
  }

  return { tasks: [] }
}

module.exports = {
  handleDryRun,
}
