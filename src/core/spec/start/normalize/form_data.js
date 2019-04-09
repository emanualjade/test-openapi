// When using a `formData` parameter, make sure the `Content-Type` request
// header includes `urlencoded` or `multipart/form-data`
// When using a `body` parameter, do the opposite.
export const filterFormDataMimes = function({ mimes, params }) {
  if (hasFormDataParams({ params })) {
    return keepFormDataMimes({ mimes })
  }

  return removeFormDataMimes({ mimes })
}

const hasFormDataParams = function({ params }) {
  return Object.keys(params).some(isFormData)
}

const keepFormDataMimes = function({ mimes }) {
  const mimesA = mimes.filter(isFormDataMime)

  // This means the spec `consumes` property does not allow `formData` MIMEs,
  // but some `formData` parameters are still used.
  // This is an error that we fix by adding the `formData` MIMEs
  if (mimesA.length === 0) {
    return FORM_DATA_MIMES
  }

  return mimesA
}

const removeFormDataMimes = function({ mimes }) {
  const mimesA = mimes.filter(mime => !isFormDataMime(mime))

  // This means the spec `consumes` property only allow `formData` MIMEs
  // (not `body`), but some `body` parameters are still used.
  // This is an error that we fix by keeping the `consumes` property as is.
  if (mimesA.length === 0) {
    return mimes
  }

  return mimesA
}

const isFormDataMime = function(mime) {
  return FORM_DATA_MIMES.some(formDataMime => mime.startsWith(formDataMime))
}

const FORM_DATA_MIMES = [
  'application/x-www-form-urlencoded',
  'multipart/form-data',
]

export const isFormData = function(key) {
  return FORM_DATA_REGEXP.test(key)
}

export const removeFormDataPrefix = function(key) {
  return key.replace(FORM_DATA_REGEXP, '')
}

const FORM_DATA_REGEXP = /^formData\./u
