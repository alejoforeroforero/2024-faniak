import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export default async function getMyCredentials() {
  const url = urls.getMyCredentials()

  return await defaultAxios()
    .get(url)
    .then(processResponse)
    .catch(dafaultCatch)
}

const processResponse = (res) => {
  printResponse("getMyCredentials", res)

  const { data } = res

  switch (data.status) {
    case "SUCCESS": return {
      credentials: data.credentials
    }
    case "NOT_LOGGED_IN": return { error: "NEEDS_ID" }
    case "NEEDS_ID":
    case "NEEDS_AUTH":
    case "GOOGLE_ERROR": return { error: data.status }
    default: return dafaultCatch(res)
  }
}