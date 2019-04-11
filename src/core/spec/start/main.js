import { groupBy } from 'lodash'

import { loadOpenApiSpec } from './load.js'
import { normalizeSpec } from './normalize/main.js'

// Parse, validate and normalize OpenAPI specifications (including JSON
// references) from each `task.spec.definition`, which can be a URL, a file
// path or directly a JavaScript object
export const start = async function(startData, { _allTasks: allTasks }) {
  const tasksGroups = groupTasks({ allTasks })

  // Make sure we run all of them in parallel.
  // We return the final result in `startData.spec`
  // `{ [task.key]: definitionObject }`
  const specStartData = await Promise.all(tasksGroups.map(loadSpec))
  const specStartDataA = Object.assign({}, ...specStartData)
  return { spec: specStartDataA }
}

// If several tasks share the same OpenAPI specification, which is very likely,
// we only load it once for all of them
const groupTasks = function({ allTasks }) {
  const tasksGroups = groupBy(allTasks, stringifyDefinition)
  const tasksGroupsA = Object.values(tasksGroups)
  return tasksGroupsA
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

const stringifyDefinition = function(task) {
  const definition = getDefinition(task)
  return JSON.stringify(definition)
}

const getDefinition = function({ spec: { definition } = {} }) {
  return definition
}
