import { handleFinalFailure } from './errors/final.js'
import { addErrorHandler } from './errors/handler.js'
import { topLevelHandler } from './errors/top.js'
import { loadConfig } from './config/main.js'
import { getTasks } from './tasks/get.js'
import { removeOriginalTasks } from './tasks/original.js'
import { loadPlugins } from './plugins/load.js'
import { loadTasks } from './run/load.js'
import { startTasks } from './run/start.js'
import { runTask } from './run/run.js'
import { completeTask } from './run/complete.js'
// eslint-disable-next-line import/max-dependencies
import { endTasks } from './run/end.js'

// Main entry point
// Does in order:
//  - load configuration
//  - load tasks
//  - load plugins
//  - run each `plugin.start()`
//  - for each task, in parallel:
//     - run each `plugin.run()`
//     - run each `plugin.complete()`
//  - run each `plugin.end()`
// Return tasks on success
// If any task failed, throw an error instead
const eRun = async function(config = {}) {
  const configA = loadConfig({ config })

  const tasks = await getTasks({ config: configA })

  const plugins = loadPlugins({ config: configA })

  const tasksA = await ePerformRun({ config: configA, tasks, plugins })
  return tasksA
}

export const run = addErrorHandler(eRun, topLevelHandler)

// Fire all plugin handlers for all tasks
const performRun = async function({ config, tasks, plugins }) {
  const { tasks: tasksA, allTasks } = await loadTasks({
    config,
    tasks,
    plugins,
  })
  const context = { _tasks: tasksA, _allTasks: allTasks }

  const startData = await startTasks({ config, context, plugins })
  const contextA = { ...context, startData }

  const tasksB = await fireTasks({ tasks: tasksA, context: contextA, plugins })

  await endTasks({ tasks: tasksB, config, context: contextA, plugins })

  const tasksC = removeOriginalTasks({ tasks: tasksB })

  handleFinalFailure({ tasks: tasksC })

  return tasksC
}

// Add `error.plugins` to every thrown error
const performRunHandler = function(error, { plugins }) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  error.plugins = plugins.map(({ name }) => name)
  throw error
}

const ePerformRun = addErrorHandler(performRun, performRunHandler)

// Fire all tasks in parallel
const fireTasks = function({ tasks, context, plugins }) {
  const tasksA = tasks.map(task => fireTask({ task, context, plugins }))
  return Promise.all(tasksA)
}

const fireTask = async function({ task, context, plugins }) {
  const taskA = await runTask({ task, context, plugins })

  const taskC = await completeTask({ task: taskA, context, plugins })

  return taskC
}
