export const config = {
  general: {
    type: 'object',
  },
  task: {
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  },
}
