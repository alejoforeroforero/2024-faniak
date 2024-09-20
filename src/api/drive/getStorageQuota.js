import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function getStorageQuota(payload = {}) {
  const url = urls.getStorageQuota()

  return await axios.post(url)
    .then((res) => {
      printResponse("getStorageQuota", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": {
          return {
            storageQuota: {
              limit: parseInt(data.storageQuota.limit ?? "-1"),
              usage: parseInt(data.storageQuota.usage),
            }
          }
        }
        case "BAD_REQUEST":
        case "GOOGLE_ERROR": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}