'use strict'

const { TestOpenApiError, addErrorHandler } = require('../../errors')
const { merge } = require('../../template')

// Merge tasks whose name include RegExp matching other task names.
// I.e. special task name to allow for shared properties
// Also merge `config.merge` to all tasks: it is like the `merge` task `*` except
// it is set on `config` instead of as a task, making it possible for the user to
// specify on CLI.
const load = function(tasks, { config: { merge: mergeConfig } }) {
  const { mergeTasks, nonMergeTasks } = splitTasks({ tasks })
  const tasksA = nonMergeTasks.map(task => mergeTask({ task, mergeTasks, mergeConfig }))
  return tasksA
}

const splitTasks = function({ tasks }) {
  const mergeTasks = tasks.filter(isMergeTask)
  const nonMergeTasks = tasks.filter(task => !isMergeTask(task))
  return { mergeTasks, nonMergeTasks }
}

const isMergeTask = function({ merge }) {
  return merge !== undefined
}

const mergeTask = function({ task, mergeTasks, mergeConfig }) {
  const mergeTasksA = findMergeTasks({ task, mergeTasks })
  if (mergeTasksA.length === 0) {
    return task
  }

  return merge(mergeConfig, ...mergeTasksA, task)
}

const findMergeTasks = function({ task: { key, path }, mergeTasks }) {
  return mergeTasks
    .filter(({ merge }) => eTestRegExp({ merge, key }))
    .sort((taskA, taskB) => compareMergeTasks({ taskA, taskB, path }))
}

const testRegExp = function({ merge, key }) {
  // Always matched case-insensitively
  const regExp = new RegExp(merge, 'i')
  return regExp.test(key)
}

const testRegExpHandler = function({ message }, { merge }) {
  throw new TestOpenApiError(`'task.merge' '${merge}' is invalid: ${message}`, {
    value: merge,
    property: 'task.merge',
  })
}

const eTestRegExp = addErrorHandler(testRegExp, testRegExpHandler)

// Compute which `merge` tasks have priority over each other.
// Mostly depends on the file it was loaded in with priority:
//   same file > no file > other files in alphabetical order
// Within the same file, `merge` tasks declared last in keys order have priority.
// Note that we do not use `config.tasks` order as globbing expansion order is not stable.
const compareMergeTasks = function({ taskA: { path: pathA }, taskB: { path: pathB }, path }) {
  // Inside the same file, we use object keys order, i.e. `merge` tasks declared
  // last have priority.
  // Object keys order is not very reliable, so we must make sure `tasks` does not
  // change order since tasks loading.
  // Returning 0 will let `Array.sort()` rely on array order instead.
  if (pathA === pathB) {
    return 0
  }

  // `merge` tasks within the same file have priority
  if (pathA === path) {
    return 1
  }

  if (pathB === path) {
    return -1
  }

  // `merge` tasks within no file (i.e. passed directly as objects) come next
  if (pathA === undefined) {
    return 1
  }

  if (pathB === undefined) {
    return -1
  }

  // We then rely on task file name alphabetical order.
  // Tasks whose filenames is closer to z have higher priority.
  if (pathA < pathB) {
    return -1
  }

  return 1
}

module.exports = {
  load,
}
