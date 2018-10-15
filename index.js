'use strict'

module.exports = {
  ...require('./src'),
  // eslint-disable-next-line import/no-internal-modules
  ...require('./src/core/spec'),
}
