export const config = {
  task: {
    type: 'object',
    patternProperties: {
      '^\\$\\$[\\w-]+$': {
        type: 'string',
      },
    },
    additionalProperties: false,
  },
}
