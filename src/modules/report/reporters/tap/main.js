'use strict'

const { report } = require('./report')
const config = require('./config')

module.exports = {
  name: 'tap',
  report,
  config,
}
