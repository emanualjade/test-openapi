'use strict'

const { serialize } = require('./serialize')
const { addUrl } = require('./url')
const { request } = require('./request')
const { parse } = require('./parse')

// Does in order:
//  - serialize request parameters
//  - build request URL
//  - send HTTP request
//  - parse HTTP response
const task = [serialize, addUrl, request, parse]

module.exports = {
  task,
}
