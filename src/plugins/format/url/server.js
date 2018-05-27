'use strict'

// Add `task.parameters.server`
const addServer = function({ config: { server: origin }, path }) {
  const originA = escapeOrigin({ origin })
  return `${originA}${path}`
}

// According to RFC 3986, all characters should be escaped in origins except:
//   [:alnum:]-.+_~!$&'()*,;=:@
// However `encodeURI()` does not escape /#? so we escape them
const escapeOrigin = function({ origin }) {
  return (
    encodeURI(origin)
      .replace(/#/g, '%23')
      .replace(/\?/g, '%3F')
      .replace(/\//g, '%2F')
      // We do not want to escape protocol slashes
      .replace(SCHEME_REGEXP, '$1//')
  )
}

// Matches URL scheme, e.g. `http://`
const SCHEME_REGEXP = /^([\w-.+]+:)%2F%2F/

module.exports = {
  addServer,
}
