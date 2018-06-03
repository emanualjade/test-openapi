'use strict'

// Get assert name using `task.key` and `task.titles`
const getAssertName = function({ task, error }) {
  const { key, titles } = getTask({ task, error })

  if (titles.length === 0) {
    return key
  }

  const titlesA = titles.join(' ')
  return `${key} - ${titlesA}`
}

const getTask = function({ task, error }) {
  if (task !== undefined) {
    return task
  }

  return error.task
}

module.exports = {
  getAssertName,
}
