'use strict'

const { addFullUrl } = require('./task')

module.exports = {
  task: addFullUrl,
  dependencies: ['tasks', 'request'],
}
