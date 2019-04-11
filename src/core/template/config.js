export const config = {
  task: {
    type: 'object',
    patternProperties: {
      '^\\$\\$[\\w-]+$': {},
    },
    additionalProperties: false,
  },
}
