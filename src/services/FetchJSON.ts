// BaseURL
// timeout
// OAuth2
const BASE_URL_PATH = process.env.REACT_APP_API_URL

const validateResponse = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response
}

const readResponseAsJSON = <T>(response: Response): Promise<T> => response.json()

const fetchJSONMIO = {
  get: <T>(path: RequestInfo, params?: RequestInit, timeout = 10000) =>
    fetch(path, params)
      .then(validateResponse)
      .then(readResponseAsJSON)
}

export {fetchJSONMIO}