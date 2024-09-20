import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'
import { parseMember } from './object'

export async function getMemberByEmail(payload = {}) {
  const url = urls.getMemberByEmail()
  const params = { email: payload.email }

  return await defaultAxios()
    .get(url, { params })
    .then((res) => {
      printResponse("getMemberByEmail", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return {
          member: parseMember(data)
        }
        case "NOT FOUND": return {}
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}