'use strict'

const { omit } = require('lodash')

const { crawl } = require('../../utils')

// Find all `deps`, i.e. references to other tasks as `taskName.*`
const findRefs = function({ task, config }) {
  const cleanTask = omit(task, CLEAN_PROPERTIES)
  const nodes = crawl(cleanTask)

  const refs = nodes.map(node => getRef({ node, config })).filter(dep => dep !== undefined)
  return refs
}

// Do not crawl some `task.*` properties for `deps`
const CLEAN_PROPERTIES = ['originalTask', 'taskKey', 'stackInfo']

// Return each `dep` as an object with:
//   depKey: 'taskName'
//   depPath: 'request|response|...'
//   path: 'request|response...'
const getRef = function({ node: { value, path }, config: { tasks } }) {
  if (typeof value !== 'string') {
    return
  }

  const depKey = getDepKey({ tasks, value })
  if (depKey === undefined) {
    return
  }

  const depPath = value.replace(`${depKey}.`, '').replace(BRACKETS_TO_DOTS, '.$1')

  return { depKey, depPath, path }
}

const getDepKey = function({ tasks, value }) {
  return tasks.map(({ taskKey }) => taskKey).find(taskKey => value.startsWith(`${taskKey}.`))
}

// Converts `a.b[0].c` to `a.b.0.c`
const BRACKETS_TO_DOTS = /\[(\d+)\]/g

module.exports = {
  findRefs,
}
