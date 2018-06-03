'use strict'

const { loadOpenApiSpec } = require('./load')
const { getOperations } = require('./normalize')
const { addSpecToTasks } = require('./tasks')

// Parse, validate and normalize an OpenAPI specification (including JSON references)
// then add it to `task.random|validate.*`
const loadNormalizedSpec = async function({ spec, tasks, pluginNames }) {
  if (spec === undefined) {
    return
  }

  const specA = await loadOpenApiSpec({ spec })

  const specB = normalizeSpec({ spec: specA })

  const tasksA = addSpecToTasks({ spec: specB, tasks, pluginNames })

  return { tasks: tasksA }
}

// Normalize specification object
const normalizeSpec = function({ spec }) {
  const operations = getOperations({ spec })
  return { operations }
}

module.exports = {
  loadNormalizedSpec,
}
