'use strict'

module.exports = {
  ...require('./config'),
  ...require('./tasks'),
  ...require('./glob'),
  ...require('./deps'),
  ...require('./spec'),
  ...require('./generate'),
  ...require('./format'),
  ...require('./url'),
  ...require('./request'),
  ...require('./validate'),
  ...require('./normalize'),
}
