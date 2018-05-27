'use strict'

const { crawl } = require('../../utils')

// Add all `deps`, i.e. references to other tasks as `operationId.taskName.*`
const addDeps = function({ tasks }) {
  const tasksA = tasks.map(task => addRefs({ task, tasks }))
  return { tasks: tasksA }
}

const addRefs = function({ task, tasks }) {
  const nodes = crawl(task)
  const refs = nodes.map(node => getRef({ node, tasks })).filter(dep => dep !== undefined)
  return { ...task, dep: { refs } }
}

// Return each `dep` as an object with:
//   depKey: 'operationId.taskName'
//   depPath: 'request|response|...'
//   path: 'request|response...'
const getRef = function({ node: { value, path }, tasks }) {
  if (typeof value !== 'string') {
    return
  }

  const depKey = tasks
    .map(({ taskKey }) => taskKey)
    .find(taskKey => value.startsWith(`${taskKey}.`))

  if (depKey === undefined) {
    return
  }

  const depPath = value.replace(`${depKey}.`, '').replace(BRACKETS_TO_DOTS, '.$1')

  return { depKey, depPath, path }
}

// Converts `a.b[0].c` to `a.b.0.c`
const BRACKETS_TO_DOTS = /\[(\d+)\]/g

module.exports = {
  addDeps,
}
