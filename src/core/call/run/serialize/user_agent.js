import readPkgUp from 'read-pkg-up'

// Caches it
const currentPackage = readPkgUp()

// Add `User-Agent` request header
// Can be overriden
export const normalizeUserAgent = async function({
  call,
  call: { 'headers.user-agent': userAgent },
}) {
  const userAgentA = await getUserAgent({ userAgent })
  return { ...call, 'headers.user-agent': userAgentA }
}

const getUserAgent = async function({ userAgent }) {
  if (userAgent !== undefined) {
    return userAgent
  }

  const {
    package: { name, version, homepage },
  } = await currentPackage
  return `${name}/${version} (${homepage})`
}
