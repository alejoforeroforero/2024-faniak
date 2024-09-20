import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export async function searchInternet(payload = {}) {
  const url = urls.searchInternet()

  const params = {
    name: payload.name,
    type: payload.type,
  }

  return await defaultAxios()
    .post(url, params)
    .then((res) => {
      printResponse("searchInternet", res)
      const { data, status } = res.data
      switch (status) {
        case 'SUCCESS': return { results: data }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}