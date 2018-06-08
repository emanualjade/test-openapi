'use strict'

const { selectOnlyTasks } = require('./start')
const config = require('./config')

module.exports = {
  name: 'only',
  dependencies: [],
  config,
  returnValue: true,
  handlers: [
    {
      type: 'start',
      handler: selectOnlyTasks,
      order: 1050,
    },
  ],
}
