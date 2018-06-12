'use strict'

const { task } = require('./task')
const { config } = require('./config.js')
const { title, errorProps } = require('./report')

module.exports = {
  config,
  report: {
    title,
    errorProps,
  },
  task,
}
