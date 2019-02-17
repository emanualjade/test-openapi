'use strict'

module.exports = {
  ...require('./dist'),
  // eslint-disable-next-line import/no-internal-modules
  ...require('./dist/core/spec'),
}
