import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse, printPayload } from '../common'

export const updateMember = async (payload = {}) => {
  const url = urls.updateMember()

  const params = {}

  for (let [key, value] of Object.entries(payload)) {

    switch (key) {
      case 'phone': params["telephone"] = value; break;
      default: params[key] = value; break;
    }
  }

  printPayload(`updateMember`, params)

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("updateMember", res)

      if (res.data.status === "SUCCESS") return {}

      return dafaultCatch(res)
    })
    .catch(dafaultCatch)
}