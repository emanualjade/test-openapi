import { isObject } from '../../utils/types.js'
import { TestOpenApiError } from '../../errors/error.js'

// Validate content of tasks specified in files
export const validateFileTasks = function({ tasks, path }) {
  if (!Array.isArray(tasks)) {
    throw new TestOpenApiError(
      `Task file '${path}' should be an array of objects not a ${typeof tasks}`,
    )
  }

  tasks.forEach(task => validateFileTask({ task, path }))
}

const validateFileTask = function({ task, path }) {
  if (isObject(task)) {
    return
  }

  throw new TestOpenApiError(
    `Task file '${path}' contains a task that is a ${typeof task} instead of an object`,
  )
}
