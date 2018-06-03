'use strict'

const { omit } = require('lodash')

const { crawl } = require('./crawl')

// Find all `deps`, i.e. references to other tasks as `KEY.*`
const findRefs = function({ task, tasks }) {
  const cleanTask = omit(task, CLEAN_PROPERTIES)
  const nodes = crawl(cleanTask)

  const refs = nodes.map(node => getRef({ node, tasks })).filter(dep => dep !== undefined)
  return refs
}

// Do not crawl some `task.*` properties for `deps`
const CLEAN_PROPERTIES = ['key', 'pluginNames', 'plugins']

// Return each `dep` as an object with:
//   depKey: 'key'
//   depPath: 'call.request|response|...'
//   path: 'call.request|response...'
const getRef = function({ node: { value, path }, tasks }) {
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
  return tasks.map(({ key }) => key).find(key => value.startsWith(`${key}.`))
}

// Converts `a.b[0].c` to `a.b.0.c`
const BRACKETS_TO_DOTS = /\[(\d+)\]/g

module.exports = {
  findRefs,
}
