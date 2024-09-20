import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'

export default async (payload = {}) => {
  const url = urls.getFolder()
  const params = {
    folder_id: payload.folder_id
  }

  return await defaultAxios()
    .post(url, params)
    .then(processResponse)
    .catch(dafaultCatch)
}

const processResponse = (res) => {
  printResponse("getFolder", res)

  if (res.data.status === "SUCCESS") return processSuccess(res.data)

  return dafaultCatch(res)
}

const processSuccess = ({ data }) => {
  return {
    folder: data
  }
}