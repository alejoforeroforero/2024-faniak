import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export const updateRelation = async (payload = {}) => {
  const url = urls.updateRelation()

  const params = {
    relation_id: payload.relation_id,
    event_params: payload.event_params,
    folder_id: payload.folder_id,
    data: payload.data || {},
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse(`updateRelation`, res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return {}
        case "ACCESS_DENIED": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}