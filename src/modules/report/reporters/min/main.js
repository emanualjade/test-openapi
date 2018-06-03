'use strict'

const { options } = require('./options')
const { complete } = require('./complete')
const { end } = require('./end')

module.exports = {
  name: 'min',
  options,
  complete,
  end,
}
