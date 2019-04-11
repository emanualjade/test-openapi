import { titleize } from 'underscore.string'

import { removePrefixes } from '../../../utils/prefix.js'
import { sortArray } from '../../../utils/sort.js'
import { yellow } from '../../report/utils/colors.js'
import { stringify } from '../../report/utils/stringify.js'

import { getTitle } from './title.js'

export const report = function({
  rawRequest,
  rawResponse,
  request,
  response,
} = {}) {
  // We haven't reached `serialize` stage yet
  if (rawRequest === undefined) {
    return {}
  }

  const title = getTitle({ rawRequest, rawResponse })
  const requestA = getRequest({ rawRequest, request })
  const responseA = getResponse({ rawResponse, response })

  return {
    title,
    rawRequest: undefined,
    rawResponse: undefined,
    request: requestA,
    response: responseA,
  }
}

// Print HTTP request in error messages
const getRequest = function({
  rawRequest,
  rawRequest: { method, url, path },
  request: { body = rawRequest.body } = {},
}) {
  const urlA = printUrl({ method, url, path })
  const headersA = printHeaders(rawRequest)
  const bodyA = printBody({ body })

  return `${urlA}${headersA}${bodyA}\n`
}

// Print HTTP response in error messages
const getResponse = function({
  rawResponse = {},
  rawResponse: { status } = {},
  response: { body = rawResponse.body } = {},
}) {
  // We haven't reached `request` stage yet
  if (status === undefined) {
    return
  }

  const statusA = printStatus({ status })
  const headersA = printHeaders(rawResponse)
  const bodyA = printBody({ body })

  return `${statusA}\n\n${headersA}${bodyA}\n`
}

const printUrl = function({ method, path, url = path }) {
  const methodA = printMethod({ method })
  return `${methodA} ${url}\n\n`
}

const printMethod = function({ method }) {
  return yellow(method.toUpperCase())
}

const printStatus = function({ status }) {
  return `${yellow('Status:')} ${status}`
}

const printHeaders = function(object) {
  const headers = removePrefixes(object, 'headers')
  const headersA = Object.entries(headers).map(printHeader)
  const headersB = sortArray(headersA)
  const headersC = headersB.join('\n')
  return headersC
}

const printHeader = function([name, value]) {
  // Both `request.headers.*` and `response.headers.*` are normalized
  // to lowercase
  const nameA = titleize(name)
  return `${yellow(`${nameA}:`)} ${value}`
}

const printBody = function({ body }) {
  if (isEmptyBody({ body })) {
    return ''
  }

  const bodyA = stringify(body, { highlight: true })
  const bodyB = bodyA.includes('\n') ? `\n${bodyA}` : `\n\n${bodyA}`
  return bodyB
}

const isEmptyBody = function({ body }) {
  return body === undefined || (typeof body === 'string' && body.trim() === '')
}
