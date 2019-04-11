export const config = {
  task: {
    type: 'object',
    properties: {
      times: {
        type: 'integer',
        minimum: 1,
      },
      data: {
        type: 'array',
        minItems: 1,
      },
    },
    additionalProperties: false,
  },
}
