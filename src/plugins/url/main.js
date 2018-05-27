'use strict'

const { addFullUrl } = require('./add')

module.exports = {
  task: addFullUrl,
  dependencies: ['tasks', 'request'],
}
