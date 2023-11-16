export const requestMethods = {
  GET: 'GET',
  POST: 'POST'
}

export const fetchAPI = async (requestURL, method, headers, body) =>
  fetch(requestURL, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`${requestURL} failed, ${response.status}`)
    }

    return response.json()
  })
