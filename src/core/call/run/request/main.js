import { fireRequest } from './fetch.js'
import { getRawResponse } from './response.js'

// Fire actual HTTP call
export const request = async function({ call, call: { rawRequest } = {} }) {
  if (call === undefined) {
    return
  }

  const rawResponse = await fireRequest({ rawRequest })

  const rawResponseA = await getRawResponse({ rawResponse, rawRequest })

  return { call: { ...call, rawResponse: rawResponseA } }
}
