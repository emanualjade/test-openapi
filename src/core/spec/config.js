export const config = {
  task: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
      },
      definition: {
        type: ['string', 'object'],
      },
    },
    additionalProperties: false,
  },
}
