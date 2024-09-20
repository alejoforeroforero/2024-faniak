import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export async function removeEmployee(payload = {}) {
  const url = urls.removeEmployee()

  const params = { id: payload.id }

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("removeEmployee", res)
      const { status } = res.data
      switch (status) {
        case "SUCCESS": return {}
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}