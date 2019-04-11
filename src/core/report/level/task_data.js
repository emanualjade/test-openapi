import { omit } from 'lodash'

import { isObject } from '../../../utils/types.js'

// Apply `config.report.REPORTER.level` to remove some `task.PLUGIN.*`
// Use `task.originalTask` but do not keep it
export const filterTaskData = function({
  task: { originalTask, ...task },
  options: {
    level: { taskData },
  },
  plugins,
}) {
  return plugins.reduce(
    (taskA, { name }) =>
      reduceTaskData({ task: taskA, originalTask, name, taskData }),
    task,
  )
}

const reduceTaskData = function({ task, originalTask, name, taskData }) {
  if (task[name] === undefined) {
    return task
  }

  return TASK_DATA[taskData]({ task, originalTask, name })
}

const keepNone = function({ task, name }) {
  return omit(task, name)
}

const keepAdded = function({ task, originalTask, name }) {
  if (originalTask[name] === undefined) {
    return task
  }

  if (!areObjects({ task, originalTask, name })) {
    return omit(task, name)
  }

  const taskValue = removeOriginalTaskKeys({ task, originalTask, name })

  if (Object.keys(taskValue).length === 0) {
    return omit(task, name)
  }

  return { ...task, [name]: taskValue }
}

const areObjects = function({ task, originalTask, name }) {
  return isObject(originalTask[name]) && isObject(task[name])
}

const removeOriginalTaskKeys = function({ task, originalTask, name }) {
  const originalTaskKeys = Object.keys(originalTask[name])
  const taskValue = omit(task[name], originalTaskKeys)
  return taskValue
}

const TASK_DATA = {
  all: ({ task }) => task,
  none: keepNone,
  added: keepAdded,
}
