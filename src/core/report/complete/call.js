import { serializeOutput } from '../../../serialize/output.js'
import { callReporters } from '../call.js'
import { isSilentTask } from '../level/silent.js'
import { filterTaskData } from '../level/task_data.js'

// Call reporters `complete` handlers
export const callComplete = async function({
  task,
  task: { error: { nested } = {} },
  reporters,
  plugins,
  context,
}) {
  // JSON serialization is performed only during reporting because:
  //  - `runTask()` should return non-serialized tasks
  //  - return value (including `error.tasks`) does not need to be serialized
  //    since it is consumed in JavaScript
  // We do not need to omit `originalTask` as it is already removed at that
  // point.
  const taskA = serializeOutput({ task, plugins })

  const arg = getArg.bind(null, { task: taskA, plugins })
  const callContext = getContext.bind(null, { task: taskA, context })

  await callReporters({ reporters, type: 'complete' }, arg, callContext)

  // Recurse over `task.error.nested`
  if (nested === undefined) {
    return
  }

  await callComplete({
    task: { ...nested, isNested: true },
    reporters,
    plugins,
    context,
  })
}

const getArg = function({ task, plugins }, { options }) {
  return filterTaskData({ task, options, plugins })
}

const getContext = function({ task, context }, { options }) {
  const silent = isSilentTask({ task, options })
  return { ...context, silent }
}
