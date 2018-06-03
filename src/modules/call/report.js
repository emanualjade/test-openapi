'use strict'

// Add `METHOD URL (STATUS)` to reporting
const title = function({ request, response }) {
  const url = getUrl({ request })
  const status = getStatus({ response })
  return [url, status].filter(part => part !== undefined).join(' ')
}

const getUrl = function({ request: { method, url } = {} }) {
  if (method === undefined || url === undefined) {
    return
  }

  const urlA = url.replace(QUERY_REGEXP, '')

  return `${method.toUpperCase()} ${urlA}`
}

// Remove query variables from URL
const QUERY_REGEXP = /\?.*/

const getStatus = function({ response: { status } = {} }) {
  if (status === undefined) {
    return
  }

  return `(${String(status)})`
}

module.exports = {
  title,
}
