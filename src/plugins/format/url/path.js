'use strict'

const { throwTaskError } = require('../../../errors')

// Retrieve `task.parameters.path`
const getPath = function({ rawRequest: { path = '' } }) {
  validatePath({ path })

  return path
}

const validatePath = function({ path }) {
  if (path === '' || path.startsWith('/')) {
    return
  }

  throwTaskError('Request path must start with a slash', { property: 'path', actual: path })
}

module.exports = {
  getPath,
}
