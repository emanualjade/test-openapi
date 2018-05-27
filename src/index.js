'use strict'

module.exports = {
  ...require('./cli'),
  ...require('./plugins/spec'),
  ...require('./init'),
}
