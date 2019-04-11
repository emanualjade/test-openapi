/* eslint-disable max-lines */
import METHODS from 'methods'

const UPPERCASE_METHODS = METHODS.map(method => method.toUpperCase())

export const config = {
  task: {
    type: 'object',
    properties: {
      method: {
        type: 'string',
        enum: [...METHODS, ...UPPERCASE_METHODS],
      },
      server: {
        type: 'string',
        pattern: '^[\\w-.+]+://',
      },
      path: {
        type: 'string',
        pattern: '^/',
      },
      body: {},
      timeout: {
        type: 'integer',
      },
      https: {
        type: 'object',
        properties: {
          ca: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          cert: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          ciphers: {
            type: 'string',
          },
          clientCertEngine: {
            type: 'string',
          },
          crl: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          dhparam: {
            type: 'string',
          },
          ecdhCurve: {
            type: 'string',
          },
          honorCipherOrder: {
            type: 'boolean',
          },
          key: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          passphrase: {
            type: 'string',
          },
          pfx: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          rejectUnauthorized: {
            type: 'boolean',
          },
          secureOptions: {
            type: 'integer',
          },
          secureProtocol: {
            type: 'string',
          },
          servername: {
            type: 'string',
          },
          sessionIdContext: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    },
    patternProperties: {
      '^url\\.[a-zA-Z_]\\w*': {},
      '^query\\..+': {},
      '^headers\\.[^A-Z]+': {},
    },
    additionalProperties: false,
  },
}
/* eslint-enable max-lines */
