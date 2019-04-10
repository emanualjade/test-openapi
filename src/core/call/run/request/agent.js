import { Agent } from 'https'

import moize from 'moize'

import { TestOpenApiError } from '../../../../errors/error.js'
import { addErrorHandler } from '../../../../errors/handler.js'

// Allow passing HTTPS options, e.g. for self-signed certificates, etc.
const getAgent = function({ https = {}, url }) {
  if (!url.startsWith(HTTPS_PROTOCOL) || Object.keys(https).length === 0) {
    return
  }

  return new Agent(https)
}

const HTTPS_PROTOCOL = 'https://'

// We want to re-use the same agent for several requests, but not if options
// are different
const mGetAgent = moize(getAgent, { isDeepEqual: true })

const getAgentHandler = function({ message }, { https }) {
  throw new TestOpenApiError(`Invalid HTTPS options: ${message}`, {
    property: 'call.https',
    value: https,
  })
}

const eGetAgent = addErrorHandler(mGetAgent, getAgentHandler)

export { eGetAgent as getAgent }
