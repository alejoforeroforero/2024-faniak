import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function exportFile(payload = {}) {
  const url = urls.exportFile()

  const params = {
    fileId: payload.id,
    mimeType: payload.mimeType,
  }

  const config = {
    responseType: 'blob',
  }

  return await axios.post(url, params, config)
    .then((res) => {
      printResponse("exportFile", res)
      const { status, data } = res
      switch (status) {
        case 200: return { blob: data }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}