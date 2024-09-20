import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function updateCredit(payload = {}, options = {}) {
  const url = urls.updateCredit()

  const params = {
    id: payload.id,
    event_params: payload.event_params,
    folder_id: payload.folder_id,
    data: payload
  }

  if (options.updateIdentity) {
    if (payload.member) {
      params.member_id = payload.member.id
    } else {
      params.email = payload.email || ""
    }
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse("updateCredit", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return {}
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}