import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import Axios from 'axios'

export const heartbeat = async (payload = {}) => {
  const url = urls.heartbeat()

  const params = {
    updated_at: payload.updated_at,
  }

  return await Axios.post(url, params)
    .then(res => {
      printResponse("heartbeat", res)

      const { data, status } = res.data

      switch (status) {
        case "SUCCESS": return {
          version: data.version,
          notifications: data.notifications,
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}