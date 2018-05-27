'use strict'

const { mergeTaskSchema } = require('../common')

// Merge `task.validate.body` to specification
const mergeVBody = function({
  operation: {
    response: { body },
  },
  validate: { body: vBody } = {},
}) {
  if (vBody === undefined) {
    return body
  }

  const schema = mergeTaskSchema({ specSchema: body, taskSchema: vBody })
  return schema
}

module.exports = {
  mergeVBody,
}
