import { User } from './firebaseUtils'

const authFetch = async (url: RequestInfo, user: User, options?: RequestInit) => {
  let idToken = user.getIdToken()
  if (!options) {
    options = {
      method: "GET",
      headers: new Headers({
        "Authorization": "Bearer " + idToken
      })
    }
  } else {
    if (!options.headers) {
      options.headers = new Headers({
        "Authorization": "Bearer " + idToken
      })
    } else {
      options.headers = new Headers({
        ...options.headers,
        "Authorization": "Bearer " + idToken
      })
    }
  }
  return await fetch(url, options)
}

export default authFetch