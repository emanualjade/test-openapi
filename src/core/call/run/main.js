import { serialize } from './serialize.js'
import { addUrl } from './url.js'
import { request } from './request.js'
import { parse } from './parse.js'

// Does in order:
//  - serialize request parameters
//  - build request URL
//  - send HTTP request
//  - parse HTTP response
export const run = [serialize, addUrl, request, parse]
