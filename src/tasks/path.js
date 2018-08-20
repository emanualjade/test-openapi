'use strict'

// Add `task.path`
// Make it as short as possible
const addTaskPath = function({ tasks, path, commonPrefix }) {
  const pathA = getTaskPath({ path, commonPrefix })
  const tasksA = tasks.map(task => ({ ...task, path: pathA }))
  return tasksA
}

const getTaskPath = function({ path, commonPrefix }) {
  const pathA = path.replace(commonPrefix, '')

  // If there is only a filename, do not start with `/`
  // Otherwise, should always start with `/`
  if (pathA.includes('/') && pathA[0] !== '/') {
    return `/${pathA}`
  }

  return pathA
}

module.exports = {
  addTaskPath,
}
