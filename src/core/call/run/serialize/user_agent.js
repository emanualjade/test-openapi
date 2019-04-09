// eslint-disable-next-line import/no-unresolved, node/no-missing-require
import { version, homepage } from '../../../../../../package.json'

// Add `User-Agent` request header
// Can be overriden
export const normalizeUserAgent = function({
  call,
  call: { 'headers.user-agent': userAgent = DEFAULT_USER_AGENT },
}) {
  return { ...call, 'headers.user-agent': userAgent }
}

const DEFAULT_USER_AGENT = `test-openapi/${version} (${homepage})`
