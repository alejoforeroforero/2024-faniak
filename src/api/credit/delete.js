import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function deleteCredit(payload = {}) {
  const url = urls.deleteCredit()

  const params = {
    id: payload.id,
    event_params: payload.event_params,
    folder_id: payload.folder_id,
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse("deleteCredit", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return {}
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}