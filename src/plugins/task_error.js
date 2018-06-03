'use strict'

// Add `error.task`
const addTaskErrorProp = function({ error, task, plugins }) {
  const taskA = getTaskErrorProp({ task, plugins })
  Object.assign(error, { task: taskA })
  return error
}

// Fire each `plugin.error()` if available to transform `error.task` for each
// plugin
const getTaskErrorProp = function({ task: { key, ...task }, plugins }) {
  const pluginTasks = plugins.map(plugin => getPluginTask({ task, plugin }))

  // Enforce properties order for `key`
  return Object.assign({ key, ...task }, ...pluginTasks)
}

const getPluginTask = function({ task, plugin: { error, name } }) {
  if (error === undefined) {
    return
  }

  const taskConfig = error(task[name])
  return { [name]: taskConfig }
}

module.exports = {
  addTaskErrorProp,
}
