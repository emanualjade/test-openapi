'use strict'

// Since each test has random parameters, when a test fails,
// we report them for easier debugging
const getValidateError = function({
  error: { message },
  fetchRequest: { method, url, headers, body },
}) {
  const headersA = getHeadersError({ headers })
  const bodyA = getBodyError({ body })
  const messageA = `${message}\nThe request was:\n${method} ${url}${headersA}${bodyA}`
  return messageA
}

const getHeadersError = function({ headers }) {
  const headersA = Object.entries(headers)
  if (headersA.length === 0) {
    return ''
  }

  const headersB = headersA.map(([name, value]) => `${name}: ${value}`).join('\n')
  const message = `\n\n${headersB}`
  return message
}

const getBodyError = function({ body }) {
  if (body === undefined || body === '') {
    return ''
  }

  return `\n\n${body}`
}

module.exports = {
  getValidateError,
}
