import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export const getThumbnails = async (payload = {}) => {
  const url = urls.getThumbnails()

  const params = {
    id_list: payload.id_list,
  }

  return await defaultAxios()
    .post(url, params)
    .then((res) => {
      printResponse("getThumbnails", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return { thumbnails: data }
        case "GOOGLE_ERROR":
        case "BAD_REQUEST": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}