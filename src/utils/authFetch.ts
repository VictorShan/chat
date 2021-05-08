import { useAuth } from 'reactfire'

const authFetch = async (url: RequestInfo, options?: RequestInit) => {
  let idToken = await useAuth().currentUser?.getIdToken()
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