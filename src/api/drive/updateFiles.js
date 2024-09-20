import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function updateFiles(payload = {}) {
  const url = urls.updateFiles()

  return await axios.post(url, payload)
    .then((res) => {
      printResponse("updateFiles", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return { file: data }
        case "GOOGLE_ERROR": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}