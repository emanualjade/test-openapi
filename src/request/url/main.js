'use strict'

const { normalizeUrl } = require('../../utils')

const { addPathParams } = require('./path')
const { addQueryParams } = require('./query')

// Build request URL from OpenAPI specification `parameters`
const getReqUrl = function({ test: { path }, opts, params }) {
  const pathA = addPathParams({ path, params })
  const urlA = normalizeReqUrl({ opts, path: pathA })
  const urlB = addQueryParams({ url: urlA, params })
  return urlB
}

const normalizeReqUrl = function({ opts: { baseUrl }, path }) {
  const url = `${baseUrl}${path}`

  try {
    return normalizeUrl({ url })
  } catch (error) {
    throw new Error(`Invalid path ${path}: ${error.message}`)
  }
}

module.exports = {
  getReqUrl,
}
