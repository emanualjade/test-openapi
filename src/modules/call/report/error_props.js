'use strict'

const { titleize } = require('underscore.string')

const { yellow, highlightValueAuto, prettifyJson } = require('../../report/utils')

// Print HTTP request in error messages
const printRequest = function({ raw: { method, url, headers, body } }) {
  const methodA = printMethod({ method })
  const headersA = printHeaders({ headers })
  const bodyA = printBody({ body })

  return `${methodA} ${url}\n\n${headersA}${bodyA}`
}

// Print HTTP response in error messages
const printResponse = function({ raw: { status, headers, body } }) {
  const statusA = printStatus({ status })
  const headersA = printHeaders({ headers })
  const bodyA = printBody({ body })

  return `${statusA}\n\n${headersA}${bodyA}`
}

const printMethod = function({ method }) {
  return yellow(method.toUpperCase())
}

const printStatus = function({ status }) {
  return `${yellow('Status:')} ${status}`
}

const printHeaders = function({ headers }) {
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

const errorProps = [
  { name: 'Request', taskValue: 'call.request', print: printRequest, indented: true },
  { name: 'Response', taskValue: 'call.response', print: printResponse, indented: true },
]

module.exports = {
  errorProps,
}
