'use strict'

const { isObject } = require('../../utils')
const { TestOpenApiError } = require('../../errors')

// Validate content of tasks specified inline
const validateInlineTasks = function({ tasks }) {
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

module.exports = {
  validateInlineTasks,
}
