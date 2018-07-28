'use strict'

const { groupBy } = require('lodash')

const { loadOpenApiSpec } = require('./load')
const { normalizeSpec } = require('./normalize')

// Parse, validate and normalize OpenAPI specifications (including JSON references)
// from each `task.spec.definition`, which can be a URL, a file path or directly
// a JavaScript object
const start = async function(startData, { config: { tasks } }) {
  // If several tasks share the same OpenAPI specification, which is very likely,
  // we only load it once for all of them
  const tasksGroups = groupBy(tasks, task => JSON.stringify(getDefinition(task)))
  const tasksGroupsA = Object.values(tasksGroups)

  // We return the final result in `startData.spec` `{ [task.key]: definitionObject }`
  const specStartData = await Promise.all(tasksGroupsA.map(loadSpec))
  const specStartDataA = Object.assign({}, ...specStartData)
  return { spec: specStartDataA }
}

// Load and normalize an OpenAPI specification
const loadSpec = async function(tasks) {
  // All tasks have same OpenAPI specification here, so just pick the first one
  const definition = getDefinition(tasks[0])
  if (definition === undefined) {
    return
  }

  const spec = await loadOpenApiSpec({ spec: definition })

  const definitionA = normalizeSpec({ spec })

  const specStartData = tasks.map(({ key }) => ({ [key]: definitionA }))
  const specStartDataA = Object.assign({}, ...specStartData)
  return specStartDataA
}

const getDefinition = function({ spec: { definition } }) {
  return definition
}

module.exports = {
  start,
}
