'use strict'

// Fire each `plugin.returnValue()` if available to transform `task` return
// value for each plugin
const getTaskReturn = function({
  task,
  task: { key },
  originalTask,
  plugins,
  aborted = false,
  error,
}) {
  const taskReturns = plugins.map(plugin => getReturnObj({ task, originalTask, plugin }))
  const errorObj = getError({ error, aborted })

  return Object.assign({ key, ...errorObj }, ...taskReturns, { aborted })
}

const getReturnObj = function({ task, originalTask, plugin: { returnValue, name } }) {
  if (typeof returnValue === 'function') {
    const taskReturn = returnValue(task[name], originalTask[name])
    return { [name]: taskReturn }
  }

  // `plugin.returnValue: false` means no task return
  if (returnValue === false) {
    return
  }

  // `plugin.returnValue: true` means return task.PLUGIN.*
  if (returnValue === true && task[name] !== undefined) {
    return { [name]: task[name] }
  }

  // defaults to return originalTask.PLUGIN.*
  if (originalTask[name] !== undefined) {
    return { [name]: originalTask[name] }
  }
}

const getError = function({ error, aborted }) {
  // When aborting a task, this means it was stopped but should be considered a success
  if (aborted || error === undefined) {
    return
  }

  return { error }
}

module.exports = {
  getTaskReturn,
}
