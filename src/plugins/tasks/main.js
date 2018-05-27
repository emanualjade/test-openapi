'use strict'

const { getTasks } = require('./get')

module.exports = {
  start: getTasks,
  dependencies: ['config'],
}
