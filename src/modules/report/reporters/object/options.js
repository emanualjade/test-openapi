'use strict'

const { Spinner } = require('../../utils')

// Add a CLI spinner updated with each complete task
const options = function({ config: { tasks } }) {
  const spinner = new Spinner({ total: tasks.length })
  return { spinner }
}

module.exports = {
  options,
}
