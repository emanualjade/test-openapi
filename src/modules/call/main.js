'use strict'

const { task } = require('./task')
const { config } = require('./config.js')
const { returnValue } = require('./return')
const { title, errorProps } = require('./report')

module.exports = {
  config,
  returnValue,
  report: {
    title,
    errorProps,
  },
  task,
}
