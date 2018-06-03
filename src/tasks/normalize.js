'use strict'

// Normalize tasks from object to array.
// Also keep track of `originalTask` as it is returned to the user.
const normalizeTasks = function({ tasks }) {
  return Object.entries(tasks).map(normalizeTask)
}

const normalizeTask = function([key, task]) {
  return { ...task, originalTask: task, key, titles: [] }
}

module.exports = {
  normalizeTasks,
}
