'use strict'

const { basename } = require('path')

const { omit } = require('lodash')

// Add `task.scope`.
// It is the filename without file extensions.
// It is `undefined` for inline tasks unless they specify it.
const addScopes = function({ tasks, path }) {
  const scope = getScope(path)
  const tasksA = tasks.map(task => ({ ...task, scope }))
  return tasksA
}

const getScope = function(path) {
  const filename = basename(path)
  const scope = filename.replace(/\..*/, '')
  return scope
}

// `task.scope` is prefixed to `task.name` to form `task.key`, used as a unique
// identifier for tasks.
// `task.key` can be parsed with `task.key.split('/')` since neither `scope` nor
// `name` are allowed to contain a slash.
// Plugins that must target other tasks should target their `task.key`
const addKey = function({ scope, name, ...task }) {
  // Make sure it is not overridden by user
  const taskA = omit(task, 'key')

  if (scope === undefined) {
    return { key: name, name, ...taskA }
  }

  const key = `${scope}/${name}`
  // Make sure those keys appear first in object keys order
  return { key, scope, name, ...task }
}

module.exports = {
  addScopes,
  getScope,
  addKey,
}
