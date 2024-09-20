import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export const createPermission = async (payload = {}) => {
  const url = urls.createPermission()
  const params = {
    fileId: payload.fileId,
    resource: {
      emailAddress: payload.emailAddress,
      role: payload.role,
      type: payload.type,
    },
    fields: payload.fields,
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse("createPermission", res)
      const { status, data, code } = res.data

      switch (status) {
        case "SUCCESS": {
          return { permission: data }
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