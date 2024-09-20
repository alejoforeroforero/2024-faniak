import urls from '../urls'
import { dafaultCatch, printPayload, printResponse } from '../common'
import axios from 'axios'

export async function updateEvent(payload = {}) {
  const url = urls.updateEvent()

  const params = {
    event_params: payload.event_params,
    resource: payload.resource,
  }

  printPayload(`updateEvent`, params)

  return await axios.post(url, params)
    .then((res) => {
      printResponse("updateEvent", res)
      const { status, data, code } = res.data
      switch (status) {
        case "SUCCESS": return { event: data }
        case "GOOGLE_ERROR": {
          switch (code) {
            case 404: return { error: "NOT_FOUND" }
            default: return { error: status }
          }
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}