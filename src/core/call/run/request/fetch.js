import fetch from 'cross-fetch'

import { removePrefixes } from '../../../../utils/prefix.js'
import { TestOpenApiError } from '../../../../errors/error.js'

import { getAgent } from './agent.js'

export const fireRequest = async function({
  rawRequest,
  rawRequest: { method, url, body, timeout, https },
}) {
  const headers = removePrefixes(rawRequest, 'headers')
  const agent = getAgent({ https, url })

  try {
    return await fetch(url, { method, headers, body, timeout, agent })
  } catch (error) {
    fireFetchHandler(error, { url, timeout })
  }
}

const fireFetchHandler = function({ message, type }, { url, timeout }) {
  if (type === 'request-timeout') {
    throw new TestOpenApiError(
      `The request to '${url}' took more than ${timeout} milliseconds`,
    )
  }

  throw new TestOpenApiError(`Could not connect to '${url}': ${message}`)
}
