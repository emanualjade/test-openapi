'use strict'

const { addSpecToRandom } = require('./random')
const { addSpecToValidate } = require('./validate')

// Add OpenAPI specification to `task.random|validate.*`
const addSpecToTasks = function({ spec, tasks, pluginNames }) {
  return tasks.map(task => addSpecToTask({ spec, task, pluginNames }))
}

const addSpecToTask = function({ spec, task, pluginNames }) {
  const taskA = addSpecToRandom({ spec, task, pluginNames })
  const taskB = addSpecToValidate({ spec, task: taskA, pluginNames })
  return taskB
}

module.exports = {
  addSpecToTasks,
}
