import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export async function updateEmployee(payload = {}) {
  const url = urls.updateEmployee()

  const params = { id: payload.id }

  // for (const [key, value] of Object.entries(payload)) {
  //   switch (key) {
  //     case "is_admin": params[key] = value; break;
  //     default: break;
  //   }
  // }

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("updateEmployee", res)
      const { status } = res.data
      switch (status) {
        case "SUCCESS": return {}
        case "SUBSCRIPTION_LIMIT_REACHED": return { error: "SUBSCRIPTION_LIMIT_REACHED" }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}