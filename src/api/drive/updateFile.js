import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function updateFile(payload = {}) {
  const url = urls.updateFile()

  return await axios.post(url, payload)
    .then((res) => {
      printResponse("updateFile", res)
      const { status, data, code } = res.data
      switch (status) {
        case "SUCCESS": return { file: data }
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