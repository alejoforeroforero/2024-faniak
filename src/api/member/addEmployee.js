import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export const addEmployee = async (payload = {}) => {
  const url = urls.addEmployee()
  const params = {}
  if (payload.id) params.member_id = payload.id
  if (payload.email) params.employee_email = payload.email

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("addEmployee", res)
      const { status } = res.data
      switch (status) {
        case "SUCCESS": return {}
        case "DUPLICATED":
        case "INVALID_PARAMS": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}