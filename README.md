# Usage

```shell
test-openapi --endpoint https://api.example.com --spec path/to/my/openapi.json
```

Automatically test your API based on a [Swagger/OpenAPI 2.0](https://www.openapis.org/)
specification.

Note: this is still quite unstable! It should get more stable in coming weeks though.

# OpenAPI

[OpenAPI](https://www.openapis.org/) (formerly Swagger) is a specification
allowing you to describe your API endpoints: URLs, parameters, responses,
authentication, etc.

For example, an API with an endpoint `GET /companies/{companyId}?hasWebsite=boolean`
returning `{ "id": companyId, "name": "Company name", "websiteUrl": "url" }`
could be described as:

```yml
swagger: '2.0'
info:
  title: Example API
  version: 1.0.0
paths:
  /companies/{companyId}:
    get:
      operationId: getCompany
      parameters:
      - name: companyId
        in: path
        required: true
        type: integer
      - name: hasWebsite
        in: query
        type: boolean
      responses:
        200:
          schema:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              websiteUrl:
                type: string
```

# Tests

To add tests, simply add the `x-tests` property to a specific operation's response.

```yml
responses:
  200:
    x-tests:
      success: {}
    schema: ...
```

The keys are the tests' names (`success`) and the value the tests' options.
Because testing is automated, most tests can simply use an empty object as option
(as above).

Each test is performed as followed:

* an HTTP request is sent to the server. Its parameters (URL, query variables,
  headers, request body) are randomly generated from the OpenAPI specification.
* the server response is validated against the OpenAPI specification's response.

For the example above:

* an HTTP request towards
  `https://api.example.com/companies/{companyId}` is sent.
* the HTTP response is validated according to the OpenAPI specification: its
  status code must be `200` and the `id`, `name` and `websiteUrl` properties
  must have valid types.

# Customizing a test

You can override request parameters values for specific tests.

For example you could add another test called `website` to check that when the
`hasWebsite` query variable is set to `true`, the returned company must have a
`websiteUrl`.

```yml
responses:
  200:
    x-tests:
      success: {}
      website:
        hasWebsite:
          const: true
        response:
          schema:
            required: [websiteUrl]
    schema: ...
```

To override request parameters, set the parameter name (here `hasWebsite`) as the
key and an [OpenAPI schema](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject)
(here `{ "const": true }`) as the value. It will be deeply merged to the
parameter's definition used to generate its value.

To override response validation, set the `response.schema` with an
[OpenAPI schema](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject).
It will be deeply merged to the response's definition used for validation.

Response headers are also validated. They can be overriden using the
`response.headers` property.

This is a simple but flexible way to help you test:

* different scenarios for the same endpoint
* a specific parameter
* error responses

# Similar projects

* [Dredd](https://github.com/apiaryio/dredd): high-profile project with a similar concept. However it only does smoke testing. In particular error responses are not validated and only one HTTP request is performed per endpoint.
* [Swagger test templates](https://github.com/apigee-127/swagger-test-templates): requires a compilation step and quite a lot of boilerplate.
