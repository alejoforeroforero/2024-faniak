import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export async function getFolderCredits(payload = {}) {
  const url = urls.getFolderCredits()
  const params = {
    folder_id: payload.folder_id,
    // for event smart folders
    event_params: payload.event_params,
  }

  return await defaultAxios()
    .post(url, params)
    .then((res) => {
      printResponse("getFolderCredits", res)
      const { status, data } = res.data

      switch (status) {
        case "SUCCESS": return { credits: data }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}