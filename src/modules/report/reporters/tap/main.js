'use strict'

const { options } = require('./options')
const { start } = require('./start')
const { complete } = require('./complete')
const { end } = require('./end')
const config = require('./config')

module.exports = {
  name: 'tap',
  config,
  options,
  start,
  complete,
  end,
}
