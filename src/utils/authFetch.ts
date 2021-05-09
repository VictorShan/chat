import { User } from './firebaseUtils'

export const authFetch = async (url: RequestInfo, user: User, options?: RequestInit) => {
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

export function postRequest(url: string, user: User, body: Body) {
  return request(url, "POST", user, body)
}
export function getRequest(url: string, user: User, body: Body) {
  return request(url, "GET", user, body)
}

async function request(url: string, method: "GET" | "POST", user: User, body: Body) {
  if (process.env.NODE_ENV === "development") {
    body.user = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
    }
  }
  return await fetch(
    url,
    {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await user.getIdToken(),
      },
      body: JSON.stringify(body),
    }
  )
}

export type Body = {
  [key: string]: string | Body | undefined | null
}