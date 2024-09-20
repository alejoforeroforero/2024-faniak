import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function authorizeGoogleAccount(payload = {}) {
  const url = urls.authorizeGoogleAccount()

  return await axios.get(url, {
    params: payload,
    headers: { 'X-Requested-With': 'XmlHttpRequest' }
  })
    .then(res => {
      printResponse("authorizeGoogleAccount", res)

      const { data, status } = res.data
      switch (status) {
        case "SUCCESS": return {}
        case "NEEDS_ID":
        case "INVALID_ACCOUNT": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}