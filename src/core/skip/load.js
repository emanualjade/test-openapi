import { testRegExp } from '../../utils.js'
import { TestOpenApiError, addErrorHandler } from '../../errors.js'

// `task.skip: anyValue` will skip those tasks
// Can also use `config.skip: 'RegExp' or ['RegExp', ...]`
export const load = function(tasks, { config: { skip: configSkip } }) {
  const tasksA = tasks.map(task => addSkipped({ task, configSkip }))
  return tasksA
}

const addSkipped = function({ task, task: { skip, key }, configSkip }) {
  if (!isSkipped({ skip, configSkip, key })) {
    return task
  }

  return { ...task, skipped: true }
}

// Any value in `task.skip` will be same as `true`. This is because templates
// are not evaluated yet, so we can't assume what the value is. But we still
// want the `skip` plugin to be performed before templating, as templating
// takes some time.
const isSkipped = function({ skip, configSkip, key }) {
  return (
    skip !== undefined ||
    (configSkip !== undefined && eTestRegExp(configSkip, key))
  )
}

const testRegExpHandler = function({ message }, configSkip) {
  throw new TestOpenApiError(
    `'config.skip' '${configSkip}' is invalid: ${message}`,
    { value: configSkip, property: 'config.skip' },
  )
}

const eTestRegExp = addErrorHandler(testRegExp, testRegExpHandler)
