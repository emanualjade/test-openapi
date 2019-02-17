'use strict'

module.exports = {
  ...require('./check'),
  ...require('./unit'),
  ...require('./test'),
  ...require('./build'),
  ...require('./coverage'),
}
