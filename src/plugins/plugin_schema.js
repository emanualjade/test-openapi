export const PLUGIN_SCHEMA = {
  type: 'object',
  properties: {
    config: {
      type: 'object',
      properties: {
        general: {},
        task: {},
      },
      patternProperties: {
        '^template\\..': {},
      },
      additionalProperties: false,
    },
    load: {},
    start: {},
    run: {},
    complete: {},
    end: {},
    report: {},
    template: {},
  },
}
