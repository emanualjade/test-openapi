'use strict'

const { normalizeParams } = require('./start')
const { fireHttpCall } = require('./task')

module.exports = {
  name: 'call',
  dependencies: ['format', 'url'],
  conf: {
    general: {
      schema: {
        type: 'object',
        properties: {
          server: {},
          timeout: {},
        },
        additionalProperties: false,
      },
    },
    'general.server': {
      schema: {
        type: 'string',
      },
    },
    'general.timeout': {
      default: 1e4,
      schema: {
        type: 'integer',
      },
    },
    task: {
      schema: {
        type: 'object',
        patternProperties: {
          '^method': {},
          '^server': {},
          '^path': {},
          '^url\\..+': {},
          '^query\\..+': {},
          '^headers\\..+': {},
          '^body': {},
        },
        propertyNames: {
          pattern: '^(method)|(server)|(path)|(url\\..+)|(query\\..+)|(^headers\\..+)|(body)',
        },
        additionalProperties: false,
      },
    },
  },
  handlers: [
    {
      type: 'start',
      handler: normalizeParams,
      order: 1100,
    },
    {
      type: 'task',
      handler: fireHttpCall,
      order: 1500,
    },
  ],
}
