import { dafaultCatch, defaultAxios, printResponse } from '../common'
import urls from '../urls'

export const migrateLegacyGig = async (payload = {}) => {
  const url = urls.migrateLegacyGig()

  const params = {
    folder_id: payload.folder_id,
    google_event_id: payload.google_event_id,
  }

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("migrateLegacyGig", res)
      const { data, status } = res.data

      switch (status) {
        case "SUCCESS": {
          return { folder: data }
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}