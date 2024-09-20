import urls from '../urls'
import { dafaultCatch, printResponse, printPayload } from '../common'
import axios from 'axios'

export const updateFolder = async (payload = {}) => {
  const url = urls.updateFolder()

  const params = {
    folder_id: payload.folder_id,
    event_params: payload.event_params,
    google_event_id: payload.google_event_id,
    google_folder_id: payload.google_folder_id,
    data: payload.data || {},
  }

  printPayload(`updateFolder`, params)

  return await axios.post(url, params)
    .then((res) => {
      printResponse(`updateFolder`, res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return {}
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}