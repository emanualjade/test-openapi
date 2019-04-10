import { runHandlers } from '../plugins/handlers.js'
import { addOriginalTasks } from '../tasks/original.js'

// Run each `plugin.load()`
// Goal is to modify `tasks`.
// `run` handlers should be prefered, but this is for the cases where `start`
// handlers `tasks|allTasks` arguments require the modification to have already
// applied, e.g.:
//  - `only` plugin must be applied before `report` plugin prints tasks count
//  - `merge` plugin must be applied before `variables` plugin so users can't
//    target
//    a `merge` task
export const loadTasks = async function({ config, tasks, plugins }) {
  const allTasks = await runHandlers({
    type: 'load',
    plugins,
    input: tasks,
    context: { config },
    mergeReturn,
  })

  const allTasksA = addOriginalTasks({ tasks: allTasks })

  // `skipped` vs `excluded`:
  //  - `skipped` tasks are still returned and reported (e.g. `skip` plugin)
  //  - `excluded` tasks are not (e.g. `only` plugin)
  // `tasks` vs `allTasks`:
  //  - `tasks` exclude `excluded` tasks
  //  - `allTasks` include `excluded` tasks (e.g. for recursive `_runTask()`)
  // Load handler can either:
  //  - transform task (including filtering it) then return it: when it needs
  //    to be performed on both `tasks` and `allTasks` (e.g. `merge` plugin)
  //  - add `excluded`: when it needs to be performed on `tasks` only (e.g.
  //    `only` plugin)
  const tasksA = allTasksA.filter(({ excluded }) => !excluded)

  return { allTasks: allTasksA, tasks: tasksA }
}

const mergeReturn = function(input, newInput) {
  if (newInput === undefined) {
    return input
  }

  return newInput
}
