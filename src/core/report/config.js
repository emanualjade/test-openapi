export const config = {
  general: {
    type: 'object',
    properties: {
      output: {
        type: 'string',
      },
      level: {
        type: 'string',
        enum: ['silent', 'error', 'warn', 'info', 'debug'],
      },
    },
  },
}
