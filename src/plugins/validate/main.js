'use strict'

const { normalizeValidate } = require('./start')
const { validateResponse } = require('./task')

module.exports = {
  name: 'validate',
  dependencies: ['call'],
  conf: {
    task: {
      schema: {
        type: 'object',
        properties: {
          status: {},
          body: {},
        },
        patternProperties: {
          '^headers\\..+': {},
        },
        propertyNames: {
          pattern: '^(status)|(headers\\..+)|(body)',
        },
        additionalProperties: false,
      },
    },
  },
  handlers: [
    {
      type: 'start',
      handler: normalizeValidate,
      order: 1200,
    },
    {
      type: 'task',
      handler: validateResponse,
      order: 1800,
    },
  ],
}
