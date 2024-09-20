import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function updateMyCalendar(payload = {}) {
  const url = urls.updateMyCalendar()

  const params = {
    calendarId: payload.id,
    resource: payload.resource,
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse("updateMyCalendar", res)
      const { status, data, code } = res.data
      switch (status) {
        case "SUCCESS": return { calendar: data }
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