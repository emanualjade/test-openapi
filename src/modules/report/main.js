'use strict'

const { start } = require('./start')
const { complete } = require('./complete')
const { end } = require('./end')
const config = require('./config')

module.exports = {
  name: 'report',
  config,
  start,
  complete,
  end,
}
