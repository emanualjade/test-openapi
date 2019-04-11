export const REPORTER_SCHEMA = {
  type: 'object',
  properties: {
    config: {
      type: 'object',
    },
    options: {},
    start: {},
    complete: {},
    end: {},
    level: {
      type: 'string',
      enum: ['silent', 'error', 'warn', 'info', 'debug'],
    },
  },
}
