import { getBackgroundData, getBackgroundParams } from '../../utils/backgroundUtils'
import { dafaultCatch, defaultAxios, printResponse } from '../common'
import urls from '../urls'

export const addAlbumsAndSongs = async (payload = {}) => {
  const url = urls.addAlbumsAndSongs()

  const params = {
    ...getBackgroundParams(payload),
    albums: payload.albums,
    parent_id: payload.parent_id,
  }

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("addAlbumsAndSongs", res)
      const { data, status } = res.data

      switch (status) {
        case "SUCCESS": {
          return getBackgroundData(res)
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}