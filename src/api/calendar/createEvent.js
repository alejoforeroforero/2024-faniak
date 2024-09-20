import { dafaultCatch, printResponse } from '../common'
import urls from '../urls'
import axios from "axios"

export async function createEvent(payload = {}) {
  const url = urls.createEvent()

  const params = {
    calendarId: payload.calendarId || "primary",
    resource: {
      guestsCanModify: true,
      guestsCanInviteOthers: true,
      guestsCanSeeOtherGuests: true,
      ...payload.resource,
    },
  }

  return await axios.post(url, params)
    .then(res => {
      printResponse("createEvent", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return { event: data }
        case "GOOGLE_ERROR": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}