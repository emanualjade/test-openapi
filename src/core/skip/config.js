export const config = {
  general: {
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  },
  task: {
    type: 'boolean',
  },
}
