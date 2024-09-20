import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import Axios from 'axios'

export const buildDocument = async (payload = {}) => {
  const url = urls.buildDocument(payload.type)
  const params = {
    folder_id: payload.folder_id,
    event_params: payload.event_params,
    params: payload.params || {},
  }

  return await Axios.post(url, params)
    .then((res) => {
      printResponse("buildDocument", res)
      const { status, data, code } = res.data

      switch (status) {
        case "SUCCESS": {
          return { file: data }
        }
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