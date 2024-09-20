import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function getMyCalendars(payload = {}) {
  const url = urls.getMyCalendars()

  const params = {
    pageToken: payload.pageToken,
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse("getMyCalendars", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": {
          return {
            calendars: data.items,
            nextSyncToken: data.nextSyncToken ?? "",
            nextPageToken: data.nextPageToken ?? "",
          }
        }
        case "BAD_REQUEST":
        case "GOOGLE_ERROR": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}