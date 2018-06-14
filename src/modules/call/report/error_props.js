'use strict'

const { titleize } = require('underscore.string')

const { removePrefixes } = require('../../../utils')
const { yellow, highlightValueAuto, prettifyJson } = require('../../report/utils')

const errorProps = function({
  call: { request: { raw: rawRequest = {} } = {}, response: { raw: rawResponse = {} } = {} },
}) {
  const request = getRequest(rawRequest)
  const response = getResponse(rawResponse)

  return { Request: request, Response: response }
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
  errorProps,
}
