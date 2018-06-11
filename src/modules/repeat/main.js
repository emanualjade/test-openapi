'use strict'

const { start } = require('./start')
const config = require('./config')

module.exports = {
  name: 'repeat',
  config,
  returnValue: true,
  start,
}
