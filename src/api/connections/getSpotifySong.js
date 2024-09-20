import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import Axios from 'axios'

export async function getSpotifySong(payload = {}) {
  const url = urls.getSpotifySong()

  const params = { spotify_id: payload.source_id }

  return await Axios.post(url, params)
    .then(res => {
      printResponse("getSpotifySong", res)
      const { status, data } = res.data

      switch (status) {
        case 'SUCCESS': return { data }
        default: return dafaultCatch(res)
      }
    }).catch(dafaultCatch)
}