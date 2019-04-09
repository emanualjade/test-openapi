import { TestOpenApiError } from '../../../../errors.js'

// Retrieve `task.call.path`
const addPath = function({ url, rawRequest: { path = '' } }) {
  validatePath({ path })

  return `${url}${path}`
}

const validatePath = function({ path }) {
  if (path === '' || path.startsWith('/')) {
    return
  }

  throw new TestOpenApiError('Request path must start with a slash', {
    property: 'task.call.path',
    value: path,
  })
}

module.exports = {
  addPath,
}
