'use strict'

const { addFullUrl } = require('./task')

module.exports = {
  name: 'url',
  task: addFullUrl,
  dependencies: ['tasks', 'request'],
}
