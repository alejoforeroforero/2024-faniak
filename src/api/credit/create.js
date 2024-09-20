import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function createCredit(payload = {}) {
  const url = urls.createCredit()

  const params = {}
  params.email = payload.email ?? ""
  params.folder_id = payload.folder_id
  params.event_params = payload.event_params
  params.data = {
    name: payload.name,
    played: payload.played,
    wrote: payload.wrote,
    others: payload.others,
    percentage_owned: payload.percentage_owned,
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse("createCredit", res)

      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return {}
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}