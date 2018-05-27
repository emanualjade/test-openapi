'use strict'

module.exports = {
  ...require('./load'),
  ...require('./validation'),
  ...require('./normalize'),
  ...require('./validate'),
  ...require('./params'),
}
