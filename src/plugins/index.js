'use strict'

module.exports = {
  ...require('./config'),
  ...require('./tasks'),
  ...require('./deps'),
  ...require('./spec'),
  ...require('./generate'),
  ...require('./format'),
  ...require('./send'),
  ...require('./validate'),
  ...require('./normalize'),
}