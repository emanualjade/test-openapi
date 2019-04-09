import { getSummary, stopSpinner } from '../../utils.js'
import { isSilentTask } from '../../level.js'

// JSON reporter
const end = function(tasks, { options, options: { spinner } }) {
  stopSpinner(spinner)

  const tasksA = getTasks({ tasks, options })
  const tasksB = JSON.stringify(tasksA, null, 2)
  return `${tasksB}\n`
}

const getTasks = function({ tasks, options }) {
  const summary = getSummary({ tasks })
  const tasksA = tasks.filter(task => !isSilentTask({ task, options }))

  return { summary, tasks: tasksA }
}

module.exports = {
  end,
}
