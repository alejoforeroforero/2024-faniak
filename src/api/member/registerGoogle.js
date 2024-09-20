import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import Axios from 'axios'

export async function registerGoogle(payload = {}) {
  const url = urls.registerGoogle()

  return await Axios
    .post(url, payload)
    .then(res => {
      printResponse("registerGoogle", res)

      switch (res.data.status) {
        case 'SUCCESS': return { token: res.data.token }
        case 'INVALID_TOKEN':
        case 'ACCOUNT_NOT_VERIFIED':
        case 'ACCOUNT_IS_ALREADY_SET':
        case 'ACCOUNT_ALREADY_EXISTS': return { error: res.data.status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}