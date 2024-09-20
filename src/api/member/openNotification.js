import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import Axios from 'axios'

export async function openNotification(payload = {}) {
  const url = urls.openNotification()
  const params = { notification_id: payload.id }

  return await Axios.post(url, params)
    .then((res) => {
      printResponse("openNotification", res)
      const { status, data } = res.data
      switch (status) {
        case 'SUCCESS': return {}
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}