'use strict'

const { checkSchema } = require('../../../validation')

const { checkRequired } = require('./required')

// Validates response body
const validateBody = function({
  validate: { body: schema },
  response: { body },
}) {
  if (schema === undefined) {
    return
  }

  checkRequired({ schema, value: body, property: PROPERTY, name: NAME })

  if (body === undefined) {
    return
  }

  checkSchema({
    schema,
    value: body,
    schemaProp: PROPERTY,
    message: `${NAME} is invalid`,
  })
}

const PROPERTY = 'task.validate.body'
const NAME = 'response body'

module.exports = {
  validateBody,
}
