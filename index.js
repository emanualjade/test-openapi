'use strict'

module.exports = {
  ...require('./src'),
  // eslint-disable-next-line import/no-internal-modules, node/no-unpublished-require
  ...require('./src/core/spec'),
}
