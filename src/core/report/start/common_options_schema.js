export const COMMON_OPTIONS_SCHEMA = {
  output: {
    type: 'string',
  },
  level: {
    type: 'string',
    enum: ['silent', 'error', 'warn', 'info', 'debug'],
  },
}
