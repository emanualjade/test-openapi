import { basename } from 'path'

import { omit } from 'lodash'

import { TestOpenApiError } from '../errors/error.js'

// Add `task.scope`.
// It is the filename without file extensions.
// It is `undefined` for inline tasks unless they specify it.
export const addScopes = function({ tasks, path }) {
  const scope = getScope(path)
  const tasksA = tasks.map(task => ({ ...task, scope }))
  return tasksA
}

export const getScope = function(path) {
  const filename = basename(path)
  const scope = filename.replace(/\..*/u, '')
  return scope
}

// `task.scope` is prefixed to `task.name` to form `task.key`, used as a unique
// identifier for tasks.
// `task.key` can be parsed with `task.key.split('/')` since neither `scope` nor
// `name` are allowed to contain a slash.
// Plugins that must target other tasks should target their `task.key`
export const addKey = function({ scope, name, ...task }) {
  // Make sure it is not overridden by user
  const taskA = omit(task, 'key')

  if (scope === undefined) {
    return { key: name, name, ...taskA }
  }

  const key = `${scope}/${name}`
  // Make sure those keys appear first in object keys order
  return { key, scope, name, ...task }
}

// Since we use filenames as `task.scope` which itself is used in `task.key`,
// and `task.key` must be unique, we validate every filename is unique.
export const validateScopes = function({ paths }) {
  const scopes = paths.map(getScope)
  scopes.forEach((scope, index) =>
    validateScope({ scope, index, scopes, paths }),
  )
}

const validateScope = function({ scope, index, scopes, paths }) {
  const scopesA = scopes.slice(index + 1)
  const duplicateScopeIndex = scopesA.indexOf(scope)

  if (duplicateScopeIndex === -1) {
    return
  }

  const path = paths[index]
  const duplicatePath = paths[duplicateScopeIndex + index + 1]
  throw new TestOpenApiError(
    `Each task file name must be unique, but the two following files are not: '${path}' and '${duplicatePath}'`,
  )
}
