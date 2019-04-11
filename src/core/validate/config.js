export const config = {
  task: {
    type: 'object',
    properties: {
      status: {
        oneOf: [
          {
            type: 'integer',
            minimum: 100,
            maximum: 599,
          },
          {
            type: 'string',
            pattern: '^[1-5][\\dxX]{2}',
          },
        ],
      },
      body: {},
    },
    patternProperties: {
      '^headers\\..+': {},
      '^[1-5][\\dxX]{2}': {
        type: 'object',
        properties: {
          body: {},
        },
        patternProperties: {
          '^headers\\..+': {},
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
}
