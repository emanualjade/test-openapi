'use strict'

const { titleize } = require('underscore.string')

const { removePrefixes } = require('../../utils')
const { yellow, highlightValueAuto, prettifyJson } = require('../report/utils')

const report = function({
  request: { raw: rawRequest = {} } = {},
  response: { raw: rawResponse = {} } = {},
}) {
  const title = getTitle({ rawRequest, rawResponse })
  const request = getRequest(rawRequest)
  const response = getResponse(rawResponse)

  return { title, Request: request, Response: response }
}

// Add `METHOD URL (STATUS)` to reporting
const getTitle = function({ rawRequest, rawResponse }) {
  const url = getUrl(rawRequest)
  const status = getStatus(rawResponse)
  return [url, status].filter(part => part !== undefined).join(' ')
}

const getUrl = function({ method, url }) {
  if (method === undefined || url === undefined) {
    return
  }

  const urlA = url.replace(QUERY_REGEXP, '')

  return `${method.toUpperCase()} ${urlA}`
}

// Remove query variables from URL
const QUERY_REGEXP = /\?.*/

const getStatus = function({ status }) {
  if (status === undefined) {
    return
  }

  return `(${status})`
}

// Print HTTP request in error messages
const getRequest = function({ method, url, body, ...rest }) {
  const methodA = printMethod({ method })
  const headersA = printHeaders(rest)
  const bodyA = printBody({ body })

  return `${methodA} ${url}\n\n${headersA}${bodyA}`
}

// Print HTTP response in error messages
const getResponse = function({ status, body, ...rest }) {
  const statusA = printStatus({ status })
  const headersA = printHeaders(rest)
  const bodyA = printBody({ body })

  return `${statusA}\n\n${headersA}${bodyA}`
}

const printMethod = function({ method }) {
  return yellow(method.toUpperCase())
}

const printStatus = function({ status }) {
  return `${yellow('Status:')} ${status}`
}

const printHeaders = function(object) {
  const headers = removePrefixes(object, 'headers')
  return Object.entries(headers)
    .map(printHeader)
    .join('\n')
}

const printHeader = function([name, value]) {
  const nameA = titleize(name)
  return `${yellow(`${nameA}:`)} ${value}`
}

const printBody = function({ body }) {
  if (body === undefined || body.trim() === '') {
    return ''
  }

  const bodyA = prettifyJson(body)
  const bodyB = highlightValueAuto(bodyA)
  return `\n\n${bodyB}`
}

module.exports = {
  report,
}
