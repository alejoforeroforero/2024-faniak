import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export async function searchExternalArtists(payload = {}) {

  const url = urls.searchExternalArtists()

  const params = {
    name: payload.name,
    source: payload.source,
  }

  return await defaultAxios()
    .post(url, params)
    .then(processResponse)
    .catch(dafaultCatch)
}

const processResponse = (res) => {
  printResponse("searchExternalArtists", res)

  if (res.data.status === "SUCCESS") return processSuccess(res.data.data)

  return dafaultCatch(res)
}

const processSuccess = (artists) => {
  return { artists: artists }
}