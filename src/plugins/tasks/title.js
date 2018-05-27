'use strict'

// `it()` title
const addTitles = function({ tasks }) {
  const paddings = getPaddings({ tasks })
  const tasksA = tasks.map(task => addTitle({ task, paddings }))
  return tasksA
}

// Returns minimal padding needed for each task property used in task titles
const getPaddings = function({ tasks }) {
  return PADDINGS.map(name => getPadding({ name, tasks }))
}

const getPadding = function({ name, tasks }) {
  const values = tasks.map(({ operation }) => operation[name].length)
  const padding = Math.max(...values)
  return padding
}

const addTitle = function({ task, task: { name }, paddings }) {
  const [method, path] = addPaddings({ task, paddings })
  const title = `${method} ${path} (${name})`
  return { ...task, title }
}

const addPaddings = function({ task, paddings }) {
  return paddings.map((padding, index) => addPadding({ padding, task, index }))
}

const addPadding = function({ padding, task: { operation }, index }) {
  const name = PADDINGS[index]
  return operation[name].padEnd(padding)
}

const PADDINGS = ['method', 'path']

module.exports = {
  addTitles,
}
