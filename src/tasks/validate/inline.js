import { isObject } from '../../utils/types.js'
import { TestOpenApiError } from '../../errors/error.js'

// Validate content of tasks specified inline
export const validateInlineTasks = function({ tasks }) {
  tasks.forEach(validateInlineTask)
}

const validateInlineTask = function(task) {
  if (isObject(task)) {
    return
  }

  throw new TestOpenApiError(
    `One of the inline tasks is a ${typeof task} but it should instead be an object`,
  )
}
