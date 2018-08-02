'use strict'

const { checkSchema } = require('../../../validation')

// Validates response status code
const validateStatus = function({
  validate: { status: schema = DEFAULT_STATUS },
  response: { status },
}) {
  if (schema === undefined) {
    return
  }

  checkSchema({
    schema,
    value: status,
    name: 'task.validate.status',
    message: 'Status code',
    target: 'schema',
    // Otherwise it uses `task.validate.status.enum`
    props: { property: 'task.validate.status' },
  })
}

const DEFAULT_STATUS = { type: 'integer', enum: [200] }

module.exports = {
  validateStatus,
}
